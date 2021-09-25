const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const {
  getMessagesInRoom,
  addMessageToRoom,
  clearMessagesFromRoom,
} = require("./messages");
const { createRoom, joinRoom, closeRoom } = require("./rooms");

const prepareIo = (io) => {
  io.on("connection", (...args) => onConnection(...args, io));
};

const onConnection = (socket, io) => {
  const ioArgs = [socket, io];

  socket.on("open", (...args) => onOpen(...args, ...ioArgs));

  socket.on("join", (...args) => onJoin(...args, ...ioArgs));

  socket.on("joined", (...args) => onJoined(...args, ...ioArgs));

  socket.on("sendMessage", (...args) => onSendMessage(...args, ...ioArgs));

  socket.on("disconnect", () => onDisconnect(...ioArgs));
};

const onOpen = ({ name, room, password }, callback, socket, io) => {
  const { error } = createRoom(room, password);
  // error = {room: "..."}
  if (!!error) {
    return callback({ error });
  } else {
    onJoin({ name, room, password }, callback, socket, io);
  }
};

const onJoin = ({ name, room, password }, callback, socket, io) => {
  const { error: joinError } = joinRoom(room, password);
  // joinError = {room : "..."} or {password: "..."}

  if (!!joinError) {
    return callback({
      error: joinError,
    });
  }

  const { error: addError } = addUser({ id: socket.id, name, room });
  // addError = {name: "..."}

  if (!!addError) {
    return callback({ error: addError });
  }

  callback({});
};

const onJoined = (callback, socket, io) => {
  const user = getUser(socket.id) || {};

  socket.emit("getPreviousMessages", getMessagesInRoom(user.room));

  socket.emit("message", {
    user: "admin",
    text: `${user.name}, welcome to the room: ${user.room}`,
  });

  socket.broadcast
    .to(user.room)
    .emit("message", { user: "admin", text: `${user.name} has joined!` });

  addMessageToRoom(user.room, {
    user: "admin",
    text: `${user.name} has joined!`,
  });

  socket.join(user.room);

  io.to(user.room).emit("roomData", {
    room: user.room,
    users: getUsersInRoom(user.room),
  });

  callback({});
};

const onSendMessage = (message, callback, socket, io) => {
  const user = getUser(socket.id);

  if (!user) {
    return callback({ error: "An Error occured" });
  }

  io.to(user.room).emit("message", { user: user.name, text: message });
  addMessageToRoom(user.room, { user: user.name, text: message });

  callback();
};

const onDisconnect = (socket, io) => {
  const { user, numRemainingUsers } = removeUser(socket.id);

  if (!!user && numRemainingUsers > 0) {
    io.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has left`,
    });

    addMessageToRoom(user.room, {
      user: "admin",
      text: `${user.name} has left`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  }

  if (numRemainingUsers === 0) {
    closeRoom(user.room);
    clearMessagesFromRoom(user.room);
  }
};

module.exports = prepareIo;
