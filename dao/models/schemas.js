const mongoose = require('mongoose');
const validator = require('validator');


// Schema for the 'products' collection
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  thumbnails: [String],
  status: Boolean,
});

// Schema for the 'messages' collection
const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

// Schema for the 'carts' collection
const cartSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
});

// Create models from the schemas
const Product = mongoose.model('products', productSchema);
const Message = mongoose.model('messages', messageSchema);
const Cart = mongoose.model('carts', cartSchema);

module.exports = {
  Product,
  Message,
  Cart,
};
