const mongoose = require('mongoose');

// Create an Order schema
const orderSchema = new mongoose.Schema({
  products: [{
    prdtId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    count: {
      type: Number, 
      required: true,
    },
    size: {
      type: String,
      required: true
    },
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paied: {
    type: Boolean,
    required: true,
    default: false,
  },
  address: {
    latitude: { type: String},
    longitude: { type: String},
    name: { type: String},
    town: { type: String},
    quater: { type: String},
    description: { type: String},
    phone: { type: String},
  },
  // Add other properties as needed, such as date, status, etc.
});

// Create an Order model using the schema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model
module.exports = Order;
