const mongoose = require("mongoose");
const User = require("./userSchema"); 
const Product = require("./productSchema"); 

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = {Cart};
