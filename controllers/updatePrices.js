const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connect to MongoDB (replace 'your_database_name' and connection string with your actual values)
mongoose.connect();

// Increase all selling prices by 25%
Product.updateMany({}, { $mul: { sellingPrice: 1.25 } })
  .then((result) => {
    console.log(`Updated ${result.nModified} products`);
    mongoose.disconnect(); // Close the connection after updating
  })
  .catch((error) => {
    console.error('Error updating products:', error);
    mongoose.disconnect(); // Close the connection in case of error
  });
