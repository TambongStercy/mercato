const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Create a User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String, // Assuming you'll store the image URL
    default: "default-avatar.jpg", // Default image URL if the user doesn't upload a custom one
  },
  telephone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value to the current date/time
  },
  token: {
    type: String,
  },
});

// Create a User model using the schema

userSchema.methods.formattedCreatedAt = function () {
  return this.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

userSchema.methods.createToken = async function () {
  const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_KEY);

  this.token = token;
  await this.save();
  return token;
};

userSchema.statics.verifyToken = async function (token) {
  const fUser = await this.findOne({
    token: token,
  });
  // const token = jwt.sign({id: this._id, email: this.email}, JWT_KEY)

  if (fUser != null) {
    return true;
  } else {
    return false;
  }
};

userSchema.methods.deleteToken = async function () {
  this.token = "";
  return await this.save();
};

const User = mongoose.model("User", userSchema);
// Export the User model
module.exports = User;
