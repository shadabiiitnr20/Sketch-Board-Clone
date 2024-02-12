const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));
const PORT = 3000;

let server = app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("Made Socket Connection");
  //Received Data
  socket.on("beginPath", (data) => {
    // data -> from frontend
    //Transfer Data to all connected computers
    io.sockets.emit("beginPath", data);
  });
  socket.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });
  socket.on("undoRedo", (data) => {
    io.sockets.emit("undoRedo", data);
  });
});
