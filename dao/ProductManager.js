const Product = require("./schemas/productSchema");
const mockProducts = require("./schemas/mockSchema");
const { loggerMiddleware } = require("../middleware/logger");
const { sendDelProd } = require("../middleware/deletedEmail");

class ProductManager {
  constructor() {}

  async deleteProduct(productId, role, userId) {
    try {
      const productToDelete = await Product.findById(productId)
        .populate({
          path: "owner",
          model: "users",
          select: "email",
        })
        .lean();
      if (!productToDelete) {
        loggerMiddleware.error("Product not found");
        return;
      }
      const userIdstr = userId.toString();
      const ownerId = productToDelete.owner._id.toString();
      const ownEm = productToDelete.owner.email;

      if (role === "premium" && ownerId !== userIdstr) {
        loggerMiddleware.error(
          "Premium user can only delete their own products"
        );
        return;
      } else {
        await Product.findByIdAndDelete(productId);
        sendDelProd(ownEm);
        loggerMiddleware.info("Product deleted successfully.");
      }
    } catch (error) {
      loggerMiddleware.error("Error deleting product:" + error.message);
    }
  }

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

  async getProducts() {
    try {
      const products = await Product.find().lean();
      return products;
    } catch (error) {
      loggerMiddleware.error("Error fetching products:" + error.message);
    }
  }

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

  async updateProduct(productId, fieldsToUpdate) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        fieldsToUpdate,
        {
          new: true,
          runValidators: true,
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
