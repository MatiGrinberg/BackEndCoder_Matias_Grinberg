const { Product } = require("./schemas");

class ProductManager {
  constructor() {
  }
  async addProduct({
    title,
    description,
    price,
    stock,
    category,
    thumbnails = [],
    status = true,
  } = {}) {
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      typeof status !== "boolean" ||
      !Array.isArray(thumbnails)
    ) {
      throw new Error(
        "Invalid product format. Check the data types of the fields."
      );
    }
    try {
      let uniqueCode;
      let newProduct;
      do {
        uniqueCode = this.generateRandomCode();
        newProduct = await Product.findOne({ code: uniqueCode });
      } while (newProduct);
      const product = new Product({
        title,
        description,
        code: uniqueCode,
        price,
        stock,
        category,
        thumbnails,
        status,
      });
      await product.save();
      console.log("Product added successfully.");
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Error adding product");
    }
  }

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
  async deleteProduct(productId) {
    try {
      const productToDelete = await Product.findByIdAndDelete(productId);
      if (!productToDelete) {
        console.error("Product not found");
        return;
      }
      console.log("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Error deleting product");
    }
  }

  // Method to list all products
  async getProducts() {
    try {
      const products = await Product.find().lean();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Error fetching products");
    }
  }

  // Method to get a product by its ID
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        console.error("Product not found");
        return null;
      }
      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Error fetching product by ID");
    }
  }

  // Method to Update a product by its ID
  async updateProduct(productId, fieldsToUpdate) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        fieldsToUpdate,
        {
          new: true, // Return the modified product
          runValidators: true, // Validate fields during update
        }
      );
      if (!product) {
        console.error("Product not found. Update failed.");
        return null;
      }
      console.log("Product updated successfully.");
      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error("Error updating product");
    }
  }
}

module.exports = ProductManager;
