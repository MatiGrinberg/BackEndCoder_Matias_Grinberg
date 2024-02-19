const mongoose = require("mongoose");
const User = require("./userSchema");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  thumbnails: {
    type: [String],
    default: ["hat1.jpg"],
  },
  status: Boolean,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "admin",
  },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
