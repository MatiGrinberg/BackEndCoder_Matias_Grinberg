const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoProductManager");
const productManager = new ProductManager();


// PRODUCTS
router
  .route("/")
  .get(async (req, res) => {
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
        products: productsList,
        jsonData: JSON.stringify({
          status: "success",
          //payload: productsList,
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
      res.status(500).json({
        status: "error",
        message: "Error fetching products: " + error.message,
      });
    }
  })
  .post(async (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    io.emit("productUpdate");
    res.json({ message: "Product added successfully" });
  });

  
router
  .route("/:id")
  .get(async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json({ status: "success", payload: product });
      } else {
        res.status(404).json({ status: "error", message: "Product not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Error fetching product by ID" });
    }
  })
  .put(async (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    io.emit("productUpdate");
    res.json({ message: "Product updated successfully" });
  })
  .delete(async (req, res) => {
    const productId = req.params.id;
    productManager.deleteProduct(productId);
    io.emit("productUpdate");
    res.json({ message: "Product deleted successfully" });
  });

module.exports = router;
