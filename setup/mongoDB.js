const mongoose = require("mongoose");
const connectionString ="mongodb+srv://MatiGrinberg:Fashion88@backendcoderhouse.pqnscj3.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;