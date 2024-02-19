const Product = require("./schemas/productSchema");
const mockProducts = require("./schemas/mockSchema");
const { loggerMiddleware } = require("../middleware/logger");

class ProductManager {
  constructor() {}
  async addProduct(
    {
      title,
      description,
      price,
      stock,
      category,
      thumbnails = [],
      status = true,
    } = {},
    ownerId
  ) {
    price = parseFloat(price);
    stock = parseInt(stock);
    status = status === "on";
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      typeof category !== "string" ||
      typeof status !== "boolean"
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
        owner: ownerId,
      });
      await product.save();
      loggerMiddleware.info("Product added successfully.");
    } catch (error) {
      loggerMiddleware.error("Error adding product:" + error.message);
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
  async deleteProduct(productId, role, userId) {
    try {
      const productToDelete = await Product.findById(productId);
      if (!productToDelete) {
        loggerMiddleware.error("Product not found");
        return;
      }
      const userIdstr = userId.toString();
      const ownerId = productToDelete.owner.toString();
      console.log(productId, role, userIdstr, ownerId);
      if (role === "premium" && ownerId !== userIdstr) {
        loggerMiddleware.error(
          "Premium user can only delete their own products"
        );
        return;
      }
      await Product.findByIdAndDelete(productId);
      loggerMiddleware.info("Product deleted successfully.");
    } catch (error) {
      loggerMiddleware.error("Error deleting product:" + error.message);
    }
  }

  // Method to list all products
  async getProducts() {
    try {
      const products = await Product.find().lean();
      return products;
    } catch (error) {
      loggerMiddleware.error("Error fetching products:" + error.message);
    }
  }

  // Method to get a product by its ID
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        loggerMiddleware.error("Product not found");
        return null;
      }
      return product;
    } catch (error) {
      loggerMiddleware.error("Error fetching product by ID:" + error.message);
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
        loggerMiddleware.error(
          "Product not found. Update failed:" + error.message
        );
        return null;
      }
      loggerMiddleware.info("Product updated successfully.");
      return product;
    } catch (error) {
      loggerMiddleware.error("Error updating product:" + error.message);
    }
  }

  // Add 100 mock products
  async addMock(res) {
    try {
      const mockData = Array.from({ length: 100 }, (_, index) => ({
        title: `Product ${index + 1}`,
        price: Math.random() * 100,
      }));
      await mockProducts.insertMany(mockData);
    } catch (error) {
      loggerMiddleware.error("Error mocking products:" + error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = ProductManager;
