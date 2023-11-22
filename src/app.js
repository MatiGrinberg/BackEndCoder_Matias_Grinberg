const express = require("express");
const exphbs = require('express-handlebars');
const WebSocket = require('ws');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8080;
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.json())

// Import the classes
const ProductManager = require("./ProductManager");
const productManager = new ProductManager("products.json");
const CartManager = require("./CartManager");
const cartManager = new CartManager("carts.json");

// WebSocket setup using Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.emit('connected', 'You are connected to the server!');

  socket.on('newProductAdded', (newProduct) => {
    productManager.addProduct(newProduct);
    const updatedProducts = productManager.getProducts();
    io.emit('productListUpdated', updatedProducts); 
  });

  socket.on('productDeleted', (productId) => {
    productManager.deleteProduct(productId);
    const updatedProducts = productManager.getProducts();
    io.emit('productListUpdated', updatedProducts); 
  });
});


// Access the root path
app.get("/", (req, res) => {
  res.send("Welcome to MG Node.js project!");
});

// Route to render realTimeProducts.handlebars for real-time updates
app.get("/realtimeproducts", (req, res) => {
  const products = productManager.getProducts();
  res.render("../views/realTimeProducts.handlebars", { products });
});

// Route to get a list of products
app.get("/products", (req, res) => {
  const products = productManager.getProducts();
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    const limitedProducts = products.slice(0, limit);
    res.render("../views/home.handlebars", { products: limitedProducts });
  } else {
    res.render("../views/home.handlebars", { products });
  }
});

// Route to add a product
app.post("/products", (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  const updatedProducts = productManager.getProducts();
  io.emit('productListUpdated', updatedProducts);
  res.json({ message: "Product added successfully" });
});

// Route to delete a product by ID
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  productManager.deleteProduct(productId);
  const updatedProducts = productManager.getProducts();
  io.emit('productListUpdated', updatedProducts);
  res.json({ message: "Product deleted successfully" });
});

// Route to update a product by ID
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedFields = req.body;
  productManager.updateProduct(productId, updatedFields);
  const updatedProducts = productManager.getProducts();
  io.emit('productListUpdated', updatedProducts);
  res.json({ message: "Product updated successfully" });
});

// Route to get a product by its ID
app.get("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});





// Route to create a new cart
app.post("/carts", (req, res) => {
  const newCart = cartManager.createCart();
  res.json({ message: 'New cart created', cart: newCart });
});

// Route to get products in a specific cart
app.get("/carts/:id", (req, res) => {
  const cartId = req.params.id;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Route to get all carts
app.get("/carts", (req, res) => {
  const allCarts = cartManager.getAllCarts();
  res.json(allCarts);
});

// Route to add a product to a specific cart
app.post("/carts/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const success = cartManager.addProductToCart(cartId, productId);
  if (success) {
    res.json({ message: 'Product added to cart successfully' });
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
