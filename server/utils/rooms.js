const { getUsers } = require("./users");

// room keys are room names
// room values contain passcode, arrays of users and messages (using user ids)

// message contains type, content, authorId, createdAt

const rooms = {};

const ROOM_EXIST_ERROR = {
  error: {
    room: "Room doesn't exist",
  },
};

// Room Related

const openRoom = (roomName, passcode) => {
  const existingRoom = rooms[roomName];
  if (!!existingRoom) {
    return { error: { room: "Room Name Taken" } };
  }

  rooms[roomName] = { passcode, users: [], messages: [] };
  return { room: { name: roomName, ...rooms[roomName] } };
};

const joinRoom = (roomName, passcode, userId) => {
  const room = rooms[roomName];

  if (!room) {
    return ROOM_EXIST_ERROR;
  } else if (room.passcode !== passcode) {
    return { error: { passcode: "Incorrect Passcode" } };
  } else if (room.users.some((id) => id === userId)) {
    return { error: { user: "Already a Member" } };
  } else {
    room.users.push(userId);
    return { room: { name: roomName, ...room } };
  }
};

const leaveRoom = (roomName, userId) => {
  const room = rooms[roomName];

  if (!room) {
    return ROOM_EXIST_ERROR;
  } else {
    room.users = room.users.filter((id) => id !== userId);
    return { room: { name: roomName, ...room } };
  }
};

const closeRoom = (roomName) => {
  delete rooms[roomName];
};

const getRoomData = (roomName) => {
  const { passcode } = rooms[roomName];
  const { users } = getUsersFromRoom(roomName);
  const { messages } = getMessages(roomName);

  return { roomData: { name: roomName, users, messages, passcode } };
};

// Users Related

const getUsersFromRoom = (roomName) => {
  const room = rooms[roomName];

  if (!room) {
    return ROOM_EXIST_ERROR;
  } else {
    const userIds = room.users;
    const users = getUsers(userIds);
    return users;
  }
};

// Message Related

const addMessage = (roomName, message) => {
  const room = rooms[roomName];

  if (!room) {
    return ROOM_EXIST_ERROR;
  } else {
    room.messages.push(message);
    return { message };
  }
};

const getMessages = (roomName) => {
  const room = rooms[roomName];

  if (!room) {
    return ROOM_EXIST_ERROR;
  } else {
    const messages = room.messages;
    return { messages };
  }
};

module.exports = {
  openRoom,
  joinRoom,
  leaveRoom,
  closeRoom,
  getRoomData,
  getUsersFromRoom,
  addMessage,
  getMessages,
};
