const express = require("express");
const router = express.Router();
const ProductServices = require("../services/ProductServices");

router
  .route("/")
  .get(async (req, res) => {
    await ProductServices.getAllProducts(req, res);
  })
  .post(async (req, res) => {
    await ProductServices.addProduct(req, res);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    await ProductServices.getProductById(req, res);
  })
  .put(async (req, res) => {
    await ProductServices.updateProduct(req, res);
  })
  .delete(async (req, res) => {
    await ProductServices.deleteProduct(req, res);
  });

module.exports = router;
