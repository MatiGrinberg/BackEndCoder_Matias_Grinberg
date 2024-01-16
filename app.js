require('dotenv').config();
const setupApp = require("./setup/expressSetup");
const setupSocket = require("./setup/socketSetup");
const db = require("./setup/mongoDB");
const app = setupApp();
const server = require("http").createServer(app);
const io = setupSocket(server);
const port = process.env.PORT;


// LOGIN/REGISTER Routes
const {
  router: authRoutes,
  initialize: initializeAuth,
} = require("./routes/authRoutes");
app.use(initializeAuth());
app.use("/", authRoutes);

// PRODUCTS Routes 
const productsRoutes = require("./routes/productsRoutes");
app.use("/products", productsRoutes);

// CARTS Routes
const cartRoutes = require("./routes/cartRoutes");
app.use("/carts", cartRoutes);

// MESSAGES Routes
const messageRoutes = require("./routes/messageRoutes");
app.use("/messages", messageRoutes);

// SERVER
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
