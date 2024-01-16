const { Cart } = require("./models/schemas");
const { Product } = require("./models/schemas");
const { Types } = require("mongoose");
const mongoose = require("mongoose");

class CartManager {
  constructor() {}

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate("products._id").lean();
      return cart;
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error("Cart not found");
        return false;
      }
      if (quantity === undefined) {
        console.error("Quantity not provided");
        return false;
      }
      const existingProduct = cart.products.find(
        (item) => item._id.toString() === productId.toString()
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ _id: productId, quantity });
      }
      await cart.save();
      return true;
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return false;
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error("Cart not found");
        return false;
      }
      const product = cart.products.find(
        (item) => item._id.toString() === productId.toString()
      );
      if (!product) {
        console.error("Product not found in cart");
        return false;
      }
      product.quantity = quantity;
      await cart.save();
      return true;
    } catch (error) {
      console.error("Error updating product quantity in cart:", error.message);
      return false;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error("Cart not found");
        return false;
      }
      cart.products = cart.products.filter(
        (item) => item._id.toString() !== productId.toString()
      );
      await cart.save();
      return true;
    } catch (error) {
      console.error("Error deleting product from cart:", error.message);
      return false;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find({});
      return carts;
    } catch (error) {
      console.error("Error fetching carts:", error.message);
      return [];
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
      console.error("Error creating cart:", error.message);
      return null;
    }
  }

  async updateCartWithProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error("Cart not found");
        return false;
      }
      console.log(products);
      cart.products = products;
      await cart.save();
      return true;
    } catch (error) {
      console.error("Error updating cart with products:", error.message);
      return false;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error("Cart not found");
        return false;
      }
      cart.products = [];
      await cart.save();
      return true;
    } catch (error) {
      console.error("Error deleting all products from cart:", error.message);
      return false;
    }
  }
}

module.exports = CartManager;
