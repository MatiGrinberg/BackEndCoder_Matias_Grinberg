const setupApp = require("./setup/expressSetup");
const setupSocket = require("./setup/socketSetup");
const db = require("./setup/mongoDB");
const app = setupApp();
const server = require("http").createServer(app);
const io = setupSocket(server);
const port = 8080;

// LOGIN/REGISTER
const {
  router: authRoutes,
  initialize: initializeAuth,
} = require("./routes/authRoutes");
app.use(initializeAuth());
app.use("/", authRoutes);

// PRODUCTS
const productsRoutes = require("./routes/productsRoutes");
app.use("/products", productsRoutes);

// CARTS
const cartRoutes = require("./routes/cartRoutes");
app.use("/carts", cartRoutes);

// MESSAGES
const messageRoutes = require("./routes/messageRoutes");
app.use("/messages", messageRoutes);

// SERVER
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
