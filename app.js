const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 8080;
app.engine('handlebars', exphbs.engine({defaultLayout:false}));
app.set('view engine', 'handlebars');
app.use(express.json())
const path = require('path');
const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://MatiGrinberg:Fashion88@backendcoderhouse.pqnscj3.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Import the classes
const ProductManager = require("./dao/mongoProductManager");
const productManager = new ProductManager();
const CartManager = require("./dao/mongoCartManager");
const cartManager = new CartManager();
const MessageManager = require("./dao/mongoMessages");

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
app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    if (!products) {
      throw new Error("Products not found");
    }
    res.render('../views/realTimeProducts.handlebars', { products });
    console.log(products);
  } catch (error) {
    res.status(500).send("Error rendering products: " + error.message);
  }
});

// Route for a list of products
app.route("/products")
  .get(async (req, res) => {
    try{
    const products = await productManager.getProducts();
    const limit = parseInt(req.query.limit);
    const limitedProducts = (!isNaN(limit) && limit > 0) ? products.slice(0, limit) : products;
    res.render("../views/home.handlebars", { products: limitedProducts });
    } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
    }
  })
  .post(async (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    io.emit('productUpdate');
    res.json({ message: "Product added successfully" });
  });


// Route for individual products
app.route("/products/:id")
  .get(async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching product by ID" });
    }
  })
  .put(async (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    io.emit('productUpdate');
    res.json({ message: "Product updated successfully" });
  })
  .delete(async (req, res) => {
    const productId = req.params.id;
    productManager.deleteProduct(productId);
    io.emit('productUpdate');
    res.json({ message: "Product deleted successfully" });
  });


// Route for all carts
app.route("/carts")
  .post(async (req, res) => {
    const newCart = cartManager.createCart();
    res.json({ message: 'New cart created', cart: newCart });
  })
  .get(async (req, res) => {
    const allCarts = cartManager.getAllCarts();
    res.json(allCarts);
  });


// Route to get products in a specific cart
app.get("/carts/:id",async (req, res) => {
  const cartId = req.params.id;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Route to add a product to a specific cart
app.post("/carts/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const success = cartManager.addProductToCart(cartId, productId);
  if (success) {
    res.json({ message: 'Product added to cart successfully' });
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Route for handling messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await MessageManager.getAllMessages();
    res.render('../views/chat.handlebars', { messages });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
});

// Route to create a new message
app.post('/messages', async (req, res) => {
  const { sender, content } = req.body;
  if (!sender || !content) {
    return res.status(400).json({ error: 'Sender and content are required' });
  }

  try {
    const newMessage = await MessageManager.createMessage(sender, content);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error creating message' });
  }
});

// Start the server
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
