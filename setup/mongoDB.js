const mongoose = require("mongoose");
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("connected", () => {
  console.log("Connected to MongoDB!");
});
module.exports = db;
