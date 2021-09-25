const rooms = {};

// A room is {room: hashed-password}

const createRoom = (room, password) => {
  room = room.trim().toLowerCase();
  const existingRoom = rooms[room];
  let error;
  if (!!existingRoom) {
    error = "Room name taken";
    return { error: { room: error } };
  }
  rooms[room] = password;
  return { room };
};

const joinRoom = (room, password) => {
  room = room.trim().toLowerCase();
  const existingPassword = rooms[room];
  let error;
  if (!existingPassword) {
    error = "Room doesn't exist";
    return { error: { room: error } };
  } else if (existingPassword !== password) {
    error = "Password incorrect";
    return { error: { password: error } };
  } else {
    return {};
  }
};

const closeRoom = (room) => {
  delete rooms[room];
  return;
};

module.exports = { createRoom, joinRoom, closeRoom };
