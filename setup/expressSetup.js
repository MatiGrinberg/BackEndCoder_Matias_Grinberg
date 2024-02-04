const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override"); // Import the method-override middleware

function setupApp() {
  const app = express();
  app.engine("handlebars", exphbs.engine({ defaultLayout: false }));
  app.set("view engine", "handlebars");
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride("_method"));
  const randomString = require("crypto").randomBytes(64).toString("hex");
  app.use(
    session({
      secret: randomString,
      resave: false,
      saveUninitialized: true,
    })
  );
  return app;
}

module.exports = setupApp;
