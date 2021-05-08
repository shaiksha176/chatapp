const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const Chat = require("./model/chat.model");
require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log(error.message));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("chat");
});
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    // const chat = new Chat({
    //   chats: [
    //     {
    //       message: msg.message,
    //       sentBy: msg.user,
    //     },
    //   ],
    // });

    //chat.save();

    Chat.findById({ _id: "60969e4781df5d2c88a9e3d5" }).then((res) => {
      res.chats.push({
        sentBy: msg.user,
        message: msg.message,
      });
      res.save();
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});

app.get("/messages", (req, res) => {
  Chat.findById({ _id: "60969e4781df5d2c88a9e3d5" }, "-_id chats").then(
    (response) => {
      res.json(response);
    }
  );
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("listening on " + port);
});
