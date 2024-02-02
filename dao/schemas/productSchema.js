const mongoose = require("mongoose");

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

module.exports = {Product};
