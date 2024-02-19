const Product = require("./schemas/productSchema");
const Cart = require("./schemas/cartSchema");
const Order = require("./schemas/orderSchema");
const { loggerMiddleware } = require("../middleware/logger");

class CartManager {
  async generateOrder(stockSplit) {
    try {
      const {
        userId: { _id: userId, email: purchaser },
        code,
        amount,
        inStock,
      } = stockSplit;
      const orderDetails = {
        userId,
        code,
        amount,
        purchaser,
        products: inStock,
      };
      const order = new Order(orderDetails);
      await order.save();
      return order;
    } catch (error) {
      loggerMiddleware.error("Error generating order:" + error.message);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId)
        .populate({
          path: "products._id",
          model: "products",
          select: "price title stock",
        })
        .populate({
          path: "userId",
          model: "users",
          select: "email",
        })
        .lean();
      const totalPrice = cart.products.reduce((total, product) => {
        return total + product.quantity * product._id.price;
      }, 0);
      cart.totalPrice = totalPrice;
      return cart;
    } catch (error) {
      loggerMiddleware.error("Error fetching cart:" + error.message);
      return null;
    }
  }

  async hasCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).lean();
      return cart || null;
    } catch (error) {
      loggerMiddleware.error("Error checking for cart:" + error.message);
      return null;
    }
  }

  async createCart(req) {
    try {
      if (!req.isAuthenticated()) {
        return null;
      }
      const newCart = await Cart.create({
        userId: req.user._id,
        products: [],
      });
      return newCart;
    } catch (error) {
      loggerMiddleware.error("Error creating cart:" + error.message);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        loggerMiddleware.error("Cart not found");
        return false;
      }
      if (quantity === undefined) {
        loggerMiddleware.error("Quantity not provided");
        return false;
      }
      const existingProductIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId.toString()
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += parseInt(quantity);
      } else {
        cart.products.push({ _id: productId, quantity: parseInt(quantity) });
      }
      await cart.save();
      loggerMiddleware.info("Product added to cart successfully.");
      return true;
    } catch (error) {
      loggerMiddleware.error("Error adding product to cart:" + error.message);
      return false;
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        loggerMiddleware.error("Cart not found");
        return false;
      }
      const product = cart.products.find(
        (item) => item._id.toString() === productId.toString()
      );
      if (!product) {
        loggerMiddleware.error("Product not found in cart");
        return false;
      }
      product.quantity = quantity;
      await cart.save();
      return true;
    } catch (error) {
      loggerMiddleware.error(
        "Error updating product quantity in cart:" + error.message
      );
      return false;
    }
  }

  async deleteManyProductFromCart(cartId, productIds) {
    try {
      const deletionResults = await Promise.all(
        productIds.map(async (productId) => {
          return await this.deleteProductFromCart(cartId, productId);
        })
      );
      const allDeletionsSuccessful = deletionResults.every((result) => result);
      if (allDeletionsSuccessful) {
        const updatedCart = await this.getCartById(cartId);
        return updatedCart;
      } else {
        return null;
      }
    } catch (error) {
      loggerMiddleware.error(
        "Error deleting multiple products from cart:" + error.message
      );
      return null;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        loggerMiddleware.error("Cart not found");
        return false;
      }
      cart.products = cart.products.filter(
        (item) => item._id.toString() !== productId.toString()
      );
      await cart.save();
      loggerMiddleware.debug("Prod_Removed_From_Cart");
      return true;
    } catch (error) {
      loggerMiddleware.error(
        "Error deleting product from cart:" + error.message
      );
      return false;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find({});
      return carts;
    } catch (error) {
      loggerMiddleware.error("Error fetching carts:" + error.message);
      return [];
    }
  }

  async updateCartWithProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        loggerMiddleware.error("Cart not found");
        return false;
      }
      cart.products = products;
      await cart.save();
      return true;
    } catch (error) {
      loggerMiddleware.error(
        "Error updating cart with products:" + error.message
      );
      return false;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        loggerMiddleware.error("Cart not found");
        return false;
      }
      cart.products = [];
      await cart.save();
      return true;
    } catch (error) {
      loggerMiddleware.error(
        "Error deleting all products from cart:" + error.message
      );
      return false;
    }
  }
}

module.exports = CartManager;
