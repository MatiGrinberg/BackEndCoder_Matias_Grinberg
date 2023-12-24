const express = require("express");
const router = express.Router();
const CartManager = require("../dao/mongoCartManager.js");
const cartManager = new CartManager();

// Carts
router
  .route("/")
  .post(async (req, res) => {
    const newCart = cartManager.createCart();
    res.json({ message: "New cart created", cart: newCart });
  })
  .get(async (req, res) => {
    try {
      const allCarts = await cartManager.getAllCarts();
      const totalPages = Math.ceil(allCarts.length / 10);
      res.json({
        status: "success",
        payload: allCarts,
        totalPages,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

router
  .route("/:cid")
  .get(async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartManager.getCartById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.render("../views/cart.handlebars", { cart });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .delete(async (req, res) => {
    const cartId = req.params.cid;
    try {
      const success = await cartManager.deleteAllProductsFromCart(cartId);
      if (success) {
        res.json({
          status: "success",
          message: "All products deleted from cart",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart not found or deletion failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;
    try {
      const success = await cartManager.updateCartWithProducts(
        cartId,
        updatedProducts
      );
      if (success) {
        res.json({
          status: "success",
          message: "Cart updated with new products",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart not found or update failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

router
  .route("/:cid/product/:pid")
  .post(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const success = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    if (success) {
      res.json({ message: "Product added to cart successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Cart or Product not found or addition failed" });
    }
  })
  .delete(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const success = await cartManager.deleteProductFromCart(
        cartId,
        productId
      );
      if (success) {
        res.json({ status: "success", message: "Product deleted from cart" });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart or Product not found or deletion failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      const success = await cartManager.updateProductQuantityInCart(
        cartId,
        productId,
        quantity
      );
      if (success) {
        res.json({
          status: "success",
          message: "Product quantity updated in cart",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart or Product not found or update failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

module.exports = router;
