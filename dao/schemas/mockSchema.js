const mongoose = require("mongoose");
const User = require("./userSchema");

const mockSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 2,
  },
  category: {
    type: String,
    default: "Accessories",
  },
  thumbnails: {
    type: [String],
    default: ["hat1.jpg"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "admin",
  },
});

const mockProducts = mongoose.model("mockproducts", mockSchema);

module.exports = mockProducts;
