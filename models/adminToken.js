const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Create an Order schema
const adminSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // Add other properties as needed, such as date, status, etc.
});

adminSchema.statics.createToken = async function () {
  const amtTkn = await this.countDocuments();
  if (amtTkn >= 3) {
    await this.deleteMany({})
  }

  const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_KEY);

  await this.create({ value: token });

  return token;
};

adminSchema.statics.verifyToken = async function (tokenValue) {
  const token = await this.findOne({ value: tokenValue });
  return !!token; // Return true if token exists, false otherwise
};

adminSchema.statics.deleteToken = async function (tokenValue) {
  await this.findOneAndDelete({ value: tokenValue });
  return await this.save();
};

// Create an Order model using the schema
const adminToken = mongoose.model("AdminToken", adminSchema);

// Export the Order model
module.exports = adminToken;
