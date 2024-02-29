const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  info: {
    title: "Your API Documentation",
    version: "1.0.0",
    description: "Documentation for your API endpoints",
  },
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
