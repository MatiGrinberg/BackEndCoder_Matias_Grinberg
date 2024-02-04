const CartManager = require("../dao/CartManager.js");
const cartManager = new CartManager();
const ProductManager = require("../dao/ProductManager");
const productManager = new ProductManager();
const stripe = require("stripe")(process.env.STRIPE_SERVER_SECRET);
const { stockCart } = require("../middleware/auxiliaryCartFunctions");

class CartServices {
  async handlePurchaseCart(req, res) {
    const cartId = req.params.cid;
    try {
      let cart = await cartManager.getCartById(cartId);
      const stockSplit = await stockCart(cart);
      const order = await cartManager.generateOrder(stockSplit);
      const productsIds = order.products.map((product) => product._id._id);
      cart = await cartManager.deleteManyProductFromCart(cart._id, productsIds);
      const orderObject = order.toObject();
      res.render("../views/purchase.handlebars", { orderObject, cart });
      return;
    } catch (error) {
      console.error("Error in Purchase:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }

  async handlePaymentCart(req, res) {
    try {
      const { tokenId, amount } = req.body;
      const stripeResponse = await stripe.charges.create({
        source: tokenId,
        amount,
      });
      res.status(200).json(stripeResponse);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Error processing payment" });
    }
  }

  async getCartByUserId(userId) {
    try {
      const cart = await cartManager.hasCart(userId);
      return cart;
    } catch (error) {
      console.error("Error getting cart by user ID:", error.message);
      return null;
    }
  }

  async handleCreateCart(req, res) {
    try {
      const newCart = await cartManager.createCart(req);

      if (newCart) {
        res.redirect("/products");
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Error creating cart" });
      }
    } catch (error) {
      console.error("Error creating cart:", error.message);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }

  async handleGetAllCarts(req, res) {
    try {
      const allCarts = await cartManager.hasCart(req.user._id);
      res.render("../views/carts.handlebars", { allCarts });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }

  async handleGetCartById(req, res) {
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
  }

  async handleDeleteAllProductsFromCart(req, res) {
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
  }

  async handleUpdateCartWithProducts(req, res) {
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
  }

  async handleAddProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      const success = await cartManager.addProductToCart(
        cartId,
        productId,
        quantity
      );
      if (success) {
        res.redirect("/products");
      } else {
        res.status(404).json({
          error: "Cart or Product not found or addition failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }

  async handleDeleteProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const success = await cartManager.deleteProductFromCart(
        cartId,
        productId
      );
      if (success) {
        res.redirect("/products");
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
  }

  async handleUpdateProductQuantityInCart(req, res) {
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
  }
}

module.exports = new CartServices();
