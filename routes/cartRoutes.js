const express = require("express");
const router = express.Router();
const cartService = require("../services/CartServices");

// Carts

router
  .route("/:cid/purchase")
  .get(async (req, res) => {
    await cartService.handlePurchaseCart(req, res);
  });

router
  .route("/:cid/payment")
  .post(async (req, res) => {
    await cartService.handlePaymentCart(req, res);
  });


router
  .route("/")
  .post(async (req, res) => {
    await cartService.handleCreateCart(req, res);
  })
  .get(async (req, res) => {
    await cartService.handleGetAllCarts(req, res);
  });

router
  .route("/:cid")
  .get(async (req, res) => {
    await cartService.handleGetCartById(req, res);
  })
  .delete(async (req, res) => {
    await cartService.handleDeleteAllProductsFromCart(req, res);
  })
  .put(async (req, res) => {
    await cartService.handleUpdateCartWithProducts(req, res);
  });

router
  .route("/:cid/product/:pid")
  .post(async (req, res) => {
    await cartService.handleAddProductToCart(req, res);
  })
  .delete(async (req, res) => {
    await cartService.handleDeleteProductFromCart(req, res);
  })
  .put(async (req, res) => {
    await cartService.handleUpdateProductQuantityInCart(req, res);
  });

module.exports = router;
