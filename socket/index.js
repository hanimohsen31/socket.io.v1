import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  let condition = onlineUsers.some((user) => user.username === username);
  !condition && onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

// implementaion
io.on("connection", (socket) => {
  console.log("Someone is Connected");
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, reciverName, type }) => {
    const reciever = getUser(reciverName);
    console.log("NOTIFICATION")
    console.log({ senderName, reciverName, type })
    io.to(reciever?.socketId).emit("GET_NOTIFICATION", {
      senderName,
      type,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
