const socketIO = require("socket.io");
const ProductManager = require("../dao/ProductManager");

// WebSocket setup using Socket.io
function setupSocket(server) {
  const io = socketIO(server);
  const productManager = new ProductManager();
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit("connected", "You are connected to the server!");

    socket.on("productUpdate", () => {
      const updatedProducts = productManager.getProducts();
      io.emit("productListUpdated", updatedProducts);
    });
  });

  return io;
}

module.exports = setupSocket;
