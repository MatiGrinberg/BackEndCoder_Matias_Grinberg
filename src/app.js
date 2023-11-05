const express = require("express");
const app = express();
const port = 3000;
app.use(express.json())

// Import the ProductManager class
const ProductManager = require("./ProductManager");
const productManager = new ProductManager("products.json");

// Access the root path
app.get("/", (req, res) => {
  res.send("Welcome to MG Node.js project!");
});

// Define a route to add a product
app.post("/products", (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.json({ message: "Product added successfully" });
});

// Define a route to update a product by ID
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedFields = req.body;
  productManager.updateProduct(productId, updatedFields);
  res.json({ message: "Product updated successfully" });
});

// Define a route to delete a product by ID
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProduct(productId);
  res.json({ message: "Product deleted successfully" });
});


// Define a route to get a list of products
app.get("/products", (req, res) => {
  const products = productManager.getProducts();
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    const limitedProducts = products.slice(0, limit);
    res.json({ products: limitedProducts });
  } else {
    res.json({ products });
  }
});

// Define a route to get a product by its ID
app.get("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
