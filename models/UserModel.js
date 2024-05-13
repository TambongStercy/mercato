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
  code:{
    type: String,
    default: "",
  },
  balance:{
    type: Number,
    default: 0,
  },
  influencer:{
    type: Number,
    default: 0,
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
// Function to increase balance when a promo code is used
userSchema.statics.increaseBalanceWithPromoCode = async function (user, promoCode, amount) {
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the provided promoCode matches with the user's code
  if (user.code !== promoCode) {
    throw new Error('Invalid promo code');
  }

  // Increase the balance
  user.balance += amount;

  // Save the updated user with increased balance
  await user.save();

  return user.balance;
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
