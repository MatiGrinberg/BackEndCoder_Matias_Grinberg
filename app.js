const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 8080;
app.engine("handlebars", exphbs.engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.use(express.json());
const path = require("path");
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://MatiGrinberg:Fashion88@backendcoderhouse.pqnscj3.mongodb.net/ecommerce?retryWrites=true&w=majority";

// Connect MongoDB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Import the classes
const ProductManager = require("./dao/mongoProductManager");
const productManager = new ProductManager();
const CartManager = require("./dao/mongoCartManager");
const cartManager = new CartManager();
const MessageManager = require("./dao/mongoMessages");

// WebSocket setup using Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("connected", "You are connected to the server!");

  socket.on("productUpdate", () => {
    const updatedProducts = productManager.getProducts();
    io.emit("productListUpdated", updatedProducts);
  });
});

// CARTS
app
  .route("/carts/:cid")
  .get(async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartManager.getCartById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.render("../views/cart.handlebars", { cart });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .delete(async (req, res) => {
    const cartId = req.params.cid;
    try {
      const success = await cartManager.deleteAllProductsFromCart(cartId);
      if (success) {
        res.json({
          status: "success",
          message: "All products deleted from cart",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart not found or deletion failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;
    console.log("Form body", updatedProducts);
    try {
      const success = await cartManager.updateCartWithProducts(
        cartId,
        updatedProducts
      );
      if (success) {
        res.json({
          status: "success",
          message: "Cart updated with new products",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart not found or update failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

app
  .route("/carts")
  .post(async (req, res) => {
    const newCart = cartManager.createCart();
    res.json({ message: "New cart created", cart: newCart });
  })
  .get(async (req, res) => {
    try {
      const allCarts = await cartManager.getAllCarts();
      const totalPages = Math.ceil(allCarts.length / 10);
      res.json({
        status: "success",
        payload: allCarts,
        totalPages,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

app
  .route("/carts/:cid/product/:pid")
  .post(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const success = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    if (success) {
      res.json({ message: "Product added to cart successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Cart or Product not found or addition failed" });
    }
  })
  .delete(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const success = await cartManager.deleteProductFromCart(
        cartId,
        productId
      );
      if (success) {
        res.json({ status: "success", message: "Product deleted from cart" });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart or Product not found or deletion failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  })
  .put(async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try {
      const success = await cartManager.updateProductQuantityInCart(
        cartId,
        productId,
        quantity
      );
      if (success) {
        res.json({
          status: "success",
          message: "Product quantity updated in cart",
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Cart or Product not found or update failed",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  });

// PRODUCTS
app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    if (!products) {
      throw new Error("Products not found");
    }
    res.render("../views/realTimeProducts.handlebars", { products });
    console.log(products);
  } catch (error) {
    res.status(500).send("Error rendering products: " + error.message);
  }
});

app
  .route("/products")
  .get(async (req, res) => {
    try {
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

app
  .route("/products/:id")
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

// MESSAGES
app.get("/messages", async (req, res) => {
  try {
    const messages = await MessageManager.getAllMessages();
    res.render("../views/chat.handlebars", { messages });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

app.post("/messages", async (req, res) => {
  const { sender, content } = req.body;
  if (!sender || !content) {
    return res.status(400).json({ error: "Sender and content are required" });
  }

  try {
    const newMessage = await MessageManager.createMessage(sender, content);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error creating message" });
  }
});

// SERVER
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
