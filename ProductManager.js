const fs = require("fs"); // Require the Node.js File System module

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.nextProductId = 1;
    this.path = filePath; // Initialize the path from the constructor argument
    this.loadProductsFromDisk(); // Load products from the file (if it exists)
  }

  // Method to add a product
  addProduct(product) {
    // Generate a unique code
    let uniqueCode;
    do {
      uniqueCode = this.generateRandomCode();
    } while (this.products.some((p) => p.code === uniqueCode));

    // Assign the generated code and increment the counter
    product.code = uniqueCode;
    // Assign a unique ID and increment the counter
    product.id = this.generateUniqueCode();
    this.products.push(product);
    this.nextProductId++;
  }

  // Method to generate a unique Id
  generateUniqueCode() {
    return this.nextProductId;
  }

  // Method to generate a unique alphanumeric code
  generateRandomCode() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 8; // Adjust the length as needed
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
      // Get the existing product
      const existingProduct = this.products[productIndex];

      // Update the specified fields with their new values
      Object.keys(fieldsToUpdate).forEach((field) => {
        if (field in existingProduct) {
          existingProduct[field] = fieldsToUpdate[field];
        }
      });

      // Ensure the ID remains unchanged
      existingProduct.id = productId;

      this.products[productIndex] = existingProduct;
      this.saveProductsToDisk(); // Save the updated products to the file
      console.log("Product updated successfully.");
    } else {
      console.error("Product not found. Update failed.");
    }
  }

  // Method to load products from the file
  saveProductsToDisk() {
    const data = JSON.stringify(this.products, null, 2);
    try {
      fs.writeFileSync(this.path, data);
      console.log("Products saved to disk.");
    } catch (error) {
      console.error("Error saving products to disk:", error.message);
    }
  }

  // Method to load products from the file
  loadProductsFromDisk() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
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

// Use the ProductManager class
const productManager = new ProductManager("products.json");

// Add products
productManager.addProduct({
  name: "Boot",
  descr: "Brown leather boot",
  price: 10.99,
  img: "assets/img/boot.jpg",
  stock: 10,
});
productManager.addProduct({
  name: "Hat",
  descr: "Brown leather hat",
  price: 15.99,
  img: "assets/img/hat.jpg",
  stock: 10,
});

// Methods execution
console.log("List of Products:", productManager.getProducts());
console.log();
console.log("Get product Id 2:", productManager.getProductById(2));
console.log();
console.log("Get product Id 3:", productManager.getProductById(3));
console.log();
productManager.updateProduct(2, {
  descr: "Black leather hat",
  price: 19.99,
  stock: 5,
});
console.log("Get single product Updated:", productManager.getProductById(2));
console.log();
productManager.deleteProduct(1);
console.log(
  "Updated products After removing one:",
  productManager.getProducts()
);
console.log();
