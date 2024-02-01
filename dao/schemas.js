const mongoose = require("mongoose");
const validator = require("validator");


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
const Product = mongoose.model("products", productSchema);


// Schema for the 'messages' collection
const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("messages", messageSchema);


// Schema for the 'carts' collection
const cartSchema = new mongoose.Schema({
  //userId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});
const Cart = mongoose.model("carts", cartSchema);


// Schema for the 'users' collection
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
    default: null,
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "Age must be an integer",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    default: null,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['admin', 'usuario'], 
    default: 'usuario', 
  },
  githubId: {
    type: String,
    unique: true,
  },
});
const User = mongoose.model("users", userSchema);


module.exports = {
  Product,
  Message,
  Cart,
  User,
};
