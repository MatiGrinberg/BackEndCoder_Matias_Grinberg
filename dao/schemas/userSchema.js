const mongoose = require("mongoose");
const validator = require("validator");

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
    enum: ["admin", "usuario", "premium"],
    default: "usuario",
  },
  githubId: {
    type: String,
    unique: true,
  },
  document: {
    type: {
      name: String,
      reference: String,
    },
    required: false,
    default: null,
  },
  last_connection: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
