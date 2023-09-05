require("dotenv").config({ path: ".env" });
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connection");
const { uploads } = require("./untils/multer");
const http = require("http");
const { Server } = require("socket.io");
const { handleSocket } = require("./untils/socketHandler");
const { notificationSchema } = require("./src/noti/model")

//PORT
const PORT = process.env.PORT || 9000;

// //connect database
connectDB();

// //midleware
app.use(uploads);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", require("./src/auth/route"));
app.use("/social", require("./src/user/route"));
app.use("/files", require("./src/files/route"));
app.use("/story", require("./src/post/route"));
app.use("/job", require("./src/task/route"));
app.use("/company", require("./src/department/route"));
app.use("/comments", require("./src/comment/route"));
app.use("/conversations", require("./src/message/route"));
app.use("/friend_requests", require("./src/friend_request/route"));
app.use("/notifications", require("./src/noti/route"));

///socket handle
const server = http.createServer(app);

// handleSocket(server)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ roomId, data }) => {
    io.to(roomId).emit("getMessage", data);
  });

  //send noti
  socket.on("sendNotification", ({ userIds, data }) => {
    userIds.forEach(userId => {
      const socketId = getUser(userId)?.socketId
      io.to(socketId).emit("getNotification", data);
    });

  });

  //join the room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
  //leave the room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });


  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


///server connect
server.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});

