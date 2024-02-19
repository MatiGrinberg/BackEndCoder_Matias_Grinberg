const ProductManager = require("../dao/ProductManager");
const productManager = new ProductManager();
const cartService = require("../services/CartServices");
const { CustomError, handleError } = require("../middleware/errorHandler");

class ProductServices {
  async getAllProducts(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect("/");
      }
      const { limit = 10, page = 1, sort, query } = req.query;
      let productsList = await productManager.getProducts();
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = parsedLimit * (parsedPage - 1);
      const totalPages = Math.ceil(productsList.length / parsedLimit);
      productsList = productsList.slice(skip, skip + parsedLimit);
      if (sort === "asc") {
        productsList = productsList.sort((a, b) => a.price - b.price);
      } else if (sort === "desc") {
        productsList = productsList.sort((a, b) => b.price - a.price);
      }
      if (query) {
        productsList = productsList.filter(
          (product) => product.category === query
        );
      }
      let cart = await cartService.getCartByUserId(req.user._id);
      const hasNextPage = parsedPage < totalPages;
      const hasPrevPage = parsedPage > 1;
      const nextPage = hasNextPage ? parsedPage + 1 : null;
      const prevPage = hasPrevPage ? parsedPage - 1 : null;
      const prevLink = hasPrevPage
        ? `/products?limit=${limit}&page=${prevPage}`
        : null;
      const nextLink = hasNextPage
        ? `/products?limit=${limit}&page=${nextPage}`
        : null;
      res.render("../views/products.handlebars", {
        cart: cart,
        products: productsList,
        userId: req.user._id,
        jsonData: JSON.stringify({
          status: "success",
          totalPages,
          prevPage,
          nextPage,
          page: parsedPage,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink,
        }),
      });
    } catch (error) {
      const customError = new CustomError(
        "Error fetching products: " + error.message,
        500
      );
      handleError(customError, res);
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;
    const ownerId = req.user._id;
    productManager.addProduct(newProduct, ownerId);
    res.json({ message: "Product added successfully" });
  }

  async getProductById(req, res) {
    const productId = req.params.id;
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json({ status: "success", payload: product });
      } else {
        const notFoundError = new CustomError("Prod not found", 404);
        handleError(notFoundError, res);
      }
    } catch (error) {
      const customError = new CustomError("Wrong Product", 500);
      handleError(customError, res);
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.id;
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    res.json({ message: "Product updated successfully" });
  }

  async deleteProduct(req, res) {
    const productId = req.params.id;
    const role = req.user.role;
    const userId = req.user._id;
    productManager.deleteProduct(productId, role, userId);
    res.json({ message: "Product deleted successfully" });
  }

  async mock(req, res) {
    productManager.addMock(res);
    res.json({ message: "Mock Products added successfully" });
  }
}

module.exports = new ProductServices();
