const { Cart } = require('./models/schemas');

class CartManager {
  constructor() {
  }
  
  async getAllCarts() {
    try {
      const carts = await Cart.find({});
      return carts;
    } catch (error) {
      console.error('Error fetching carts:', error.message);
      return [];
    }
  }
  
  async createCart() {
    try {
      const lastCart = await Cart.findOne().sort({ _id: -1 }).limit(1);
      const lastId = lastCart ? parseInt(lastCart._id) : 0;
      const newCart = await Cart.create({ _id: lastId + 1, userId: 'user_id', products: [] });
      return newCart;
    } catch (error) {
      console.error('Error creating cart:', error.message);
      return null;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ _id: cartId });
      return cart;
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.error('Cart not found');
        return false;
      }
      const existingProduct = cart.products.find((item) => item.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
      return true;
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      return false;
    }
  }

}

module.exports = CartManager;
