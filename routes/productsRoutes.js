const express = require("express");
const router = express.Router();
const ProductServices = require("../services/ProductServices");
const roleMiddleware = require("../middleware/roleAuth");

router.route("/mockingproducts").get(async (req, res) => {
  await ProductServices.mock(req, res);
});

router
  .route("/")
  .get(async (req, res) => {
    await ProductServices.getAllProducts(req, res);
  })
  .post(roleMiddleware(["admin", "premium"]), async (req, res) => {
    await ProductServices.addProduct(req, res);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    await ProductServices.getProductById(req, res);
  })
  .put(roleMiddleware(["admin"]), async (req, res) => {
    await ProductServices.updateProduct(req, res);
  })
  .delete(roleMiddleware(["admin", "premium"]), async (req, res) => {
    await ProductServices.deleteProduct(req, res);
  });

module.exports = router;
