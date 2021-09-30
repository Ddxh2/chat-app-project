const {
  addUser,
  addRoomToUser,
  removeRoomFromUser,
  getUser,
  deleteUser,
} = require("./users");
const {
  openRoom,
  joinRoom,
  leaveRoom,
  closeRoom,
  getRoomData,
  addMessage,
  getMessages,
} = require("./rooms");

const MESSAGE_TYPES = { TEXT: "TEXT", IMAGE: "IMAGE", ADMIN: "ADMIN" };

const prepareIo = (io) => {
  io.on("connection", (...args) => onConnection(...args, io));
};

const onConnection = (socket, io) => {
  const ioArgs = [socket, io];

  const callbackWrapper =
    (callback) =>
    (...args) =>
      callback(...args, ...ioArgs);

  socket.on("signUp", callbackWrapper(onSignUp));

  socket.on("open", callbackWrapper(onOpen));

  socket.on("join", callbackWrapper(onJoin));

  socket.on("joined", callbackWrapper(onJoined));

  socket.on("leave", callbackWrapper(onLeave));

  socket.on("sendMessage", callbackWrapper(onSendMessage));

  socket.on("getRoomData", callbackWrapper(onGetRoomData));

  socket.on("logout", callbackWrapper(onLogOut));

  socket.on("disconnect", () => onDisconnect(...ioArgs));
};

const onSignUp = (name, callback, socket) => {
  const { error, user } = addUser(socket.id, name);
  if (!!error) {
    return callback({ error });
  } else {
    return callback({ user });
  }
};

const onOpen = (roomToOpen, callback, socket) => {
  const { name, passcode } = roomToOpen;
  const { error: openError, room } = openRoom(name, passcode);

  if (!!openError) {
    return callback({ error: openError });
  } else {
    onJoin(room, callback, socket);
  }
};

const onJoin = (room, callback, socket) => {
  const { id } = socket;
  const { name, passcode } = room;

  const { error: joinError, room: joinedRoom } = joinRoom(name, passcode, id);

  if (!!joinError) {
    return callback({ error: joinError });
  }

  const { error: userError, user } = addRoomToUser(id, name);

  if (!!userError) {
    leaveRoom(name, id);
    return callback({ error: userError });
  }

  const adminMessage = {
    authorId: MESSAGE_TYPES.ADMIN,
    type: MESSAGE_TYPES.ADMIN,
    content: `${user.name} has joined!`,
    createdAt: new Date().toISOString(),
  };

  const { error: addMessageError } = addMessage(name, adminMessage);

  if (!!addMessageError) {
    return callback({ error: addMessageError });
  }
  socket.broadcast.to(name).emit("message", adminMessage, name);

  socket.join(name);

  return callback({ user, room: joinedRoom });
};

const onJoined = (roomName, callback, socket) => {
  const { error: userError, user } = getUser(socket.id);

  if (!!userError) {
    return callback({ error: userError });
  }

  const { error: getError, messages: previousMessages } = getMessages(roomName);

  if (!!getError) {
    return callback({ error: getError });
  }

  callback({ user, messages: previousMessages });
};

const onSendMessage = (roomName, message, callback, socket, io) => {
  const { error, message: addedMessage } = addMessage(roomName, message);

  if (!!error) {
    return callback({ error });
  } else {
    io.to(roomName).emit("message", addedMessage, roomName);
    socket.broadcast.to(roomName).emit("notification", roomName);
    callback({ message: addedMessage });
  }
};

const onLeave = (roomName, callback, socket, io) => {
  const { error: userError, user } = getUser(socket.id);

  if (!!userError) {
    return callback({ error: userError });
  }

  const { error: roomError } = leaveRoom(roomName, socket.id);

  if (!!roomError) {
    return callback({ error: roomError });
  } else {
    removeRoomFromUser(socket.id, roomName);

    const adminUserLeftMessage = {
      authorId: MESSAGE_TYPES.ADMIN,
      type: MESSAGE_TYPES.ADMIN,
      content: `${user.name} has left`,
      createdAt: new Date().toISOString(),
    };

    addMessage(roomName, adminUserLeftMessage);

    io.to(roomName).emit("message", adminUserLeftMessage, roomName);

    callback({});
  }
};

const onGetRoomData = (roomName, callback) => {
  const { roomData } = getRoomData(roomName);

  callback(roomData);
};

const onLogOut = (callback, socket, io) => {
  const { user } = getUser(socket.id);
  const userRooms = (!!user && user.rooms) || [];

  userRooms.forEach((roomName) => {
    const { room } = leaveRoom(roomName, socket.id);
    const numRemainingUsers = room.users.length;
    if (numRemainingUsers === 0) {
      closeRoom(roomName);
    } else {
      const adminUserLeftMessage = {
        authorId: MESSAGE_TYPES.ADMIN,
        type: MESSAGE_TYPES.ADMIN,
        content: `${user.name} has left`,
        createdAt: new Date().toISOString(),
      };

      addMessage(roomName, adminUserLeftMessage);

      io.to(roomName).emit("message", adminUserLeftMessage, roomName);
    }
  });

  deleteUser(socket.id);

  callback();
};

const onDisconnect = (socket, io) => {
  onLogOut(() => {}, socket, io);
};

module.exports = prepareIo;
