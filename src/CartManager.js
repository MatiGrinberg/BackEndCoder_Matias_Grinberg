const fs = require("fs");

class CartManager {
  constructor(filePath) {
    this.carts = [];
    this.path = filePath;
    this.loadCartsFromDisk();
  }
  
  getAllCarts() {
    return this.carts;
  }
  
  createCart() {
    const cartId = this.generateUniqueId();
    const newCart = {
      id: cartId,
      products: [],
    };
    this.carts.push(newCart);
    this.saveCartsToDisk();
    return newCart;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const existingProduct = cart.products.find((item) => item.product === productId);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      this.saveCartsToDisk();
      return true;
    }
    return false;
  }

  async saveCartsToDisk() {
    const data = JSON.stringify(this.carts, null, 2);
    try {
      await fs.promises.writeFile(this.path, data);
      console.log("Carts saved to disk.");
    } catch (error) {
      console.error("Error saving carts to disk:", error.message);
    }
  }

  async loadCartsFromDisk() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      console.log("Carts loaded from disk.");
    } catch (error) {
      console.error("Error loading carts from disk:", error.message);
    }
  }

  generateUniqueId() {
    return Date.now().toString();
  }
}

module.exports = CartManager;
