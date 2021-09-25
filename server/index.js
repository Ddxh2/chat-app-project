const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const router = require("./utils/router");
const prepareIo = require("./utils/io");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
  },
});

prepareIo(io);

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
