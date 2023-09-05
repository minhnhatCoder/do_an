/*
 * @description    
 * @since         Monday, 9 4th 2023, 21:51:17 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */


const { Server } = require("socket.io");
const { addUser, removeUser, users, getUser } = require("./users");

let io

function handleSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        // When connect
        console.log("a user connected.");

        // Take userId and socketId from user
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });

        // Send and get message
        socket.on("sendMessage", ({ roomId, data }) => {
            io.to(roomId).emit("getMessage", data);
        });

        // Join the room
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
        });

        // Leave the room
        socket.on("leaveRoom", (roomId) => {
            socket.leave(roomId);
        });

        // When disconnect
        socket.on("disconnect", () => {
            console.log("a user disconnected!");
            removeUser(socket.id);
            io.emit("getUsers", users);
        });
    });
    return io
}

module.exports = {
    handleSocket
};
