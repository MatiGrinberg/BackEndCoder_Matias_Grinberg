const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
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

  socket.on('productUpdate', () => {
    const updatedProducts = productManager.getProducts();
    io.emit('productListUpdated', updatedProducts);
  });
});


// Route to render realTimeProducts.handlebars for real-time updates
app.get("/realtimeproducts", (req, res) => {
  const products = productManager.getProducts();
  res.render("../views/realTimeProducts.handlebars", { products });
});

// Route for a list of products
app.route("/products")
  .get((req, res) => {
    const products = productManager.getProducts();
    const limit = parseInt(req.query.limit);
    const limitedProducts = (!isNaN(limit) && limit > 0) ? products.slice(0, limit) : products;
    res.render("../views/home.handlebars", { products: limitedProducts });
  })
  .post((req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    io.emit('productUpdate');
    res.json({ message: "Product added successfully" });
  });

// Route for individual products
app.route("/products/:id")
  .get((req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  })
  .put((req, res) => {
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    io.emit('productUpdate');
    res.json({ message: "Product updated successfully" });
  })
  .delete((req, res) => {
    const productId = parseInt(req.params.id);
    productManager.deleteProduct(productId);
    io.emit('productUpdate');
    res.json({ message: "Product deleted successfully" });
  });



// Route for all carts
app.route("/carts")
  .post((req, res) => {
    const newCart = cartManager.createCart();
    res.json({ message: 'New cart created', cart: newCart });
  })
  .get((req, res) => {
    const allCarts = cartManager.getAllCarts();
    res.json(allCarts);
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
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
