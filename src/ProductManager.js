const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.nextProductId = 1;
    this.path = filePath;
    this.loadProductsFromDisk();
  }

  // Method to add a product
  addProduct(product) {
    let uniqueCode;
    do {
      uniqueCode = this.generateRandomCode();
    } while (this.products.some((p) => p.code === uniqueCode));
    product.code = uniqueCode;
    product.id = this.generateUniqueId();
    this.products.push(product);
    this.nextProductId++;
    this.saveProductsToDisk();
  }

  // Method to generate a unique Id
  generateUniqueId() {
    return this.nextProductId;
  }

  // Method to generate a unique Code
  generateRandomCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 8;
    let code = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  // Method to remove a product by its ID
  deleteProduct(productId) {
    this.products = this.products.filter((product) => product.id !== productId);
  }

  // Method to list all products
  getProducts() {
    return this.products;
  }

  // Method to get a product by its ID
  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);
    if (!product) {
      console.error("Product not found");
    }
    return product;
  }

  // Method to Update a product by its ID
  updateProduct(productId, fieldsToUpdate) {
    const productIndex = this.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      const existingProduct = this.products[productIndex];
      Object.keys(fieldsToUpdate).forEach((field) => {
        if (field in existingProduct) {
          existingProduct[field] = fieldsToUpdate[field];
        }
      });
      existingProduct.id = productId;
      this.products[productIndex] = existingProduct;
      this.saveProductsToDisk();
      console.log("Product updated successfully.");
    } else {
      console.error("Product not found. Update failed.");
    }
  }

  // Method to save products to the file
  async saveProductsToDisk() {
    const data = JSON.stringify(this.products, null, 2);
    try {
      await fs.promises.writeFile(this.path, data);
      console.log("Products saved to disk.");
    } catch (error) {
      console.error("Error saving products to disk:", error.message);
    }
  }

  // Method to load products from the file
  async loadProductsFromDisk() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      const lastProduct = this.products[this.products.length - 1];
      if (lastProduct) {
        this.nextProductId = lastProduct.id + 1;
      }
      console.log("Products loaded from disk.");
    } catch (error) {
      console.error("Error loading products from disk:", error.message);
    }
  }
}

module.exports = ProductManager;
