const mongoose = require('mongoose');

// Create a Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category:{
    type:String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    // required: true,
  },
  imageId: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: '0',
  }

});

// Create a Product model using the schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;

