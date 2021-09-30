// key --> socket id
// value --> user's name and rooms

const users = {};

const USER_EXIST_ERROR = { error: { user: "User doesn't exist" } };

const addUser = (id, name) => {
  const existingUser = Object.values(users).some(
    ({ name: userName }) => userName === name
  );
  if (!!existingUser) {
    return { error: { user: "User already exists" } };
  } else {
    users[id] = { name, rooms: [] };
    return { user: { id, ...users[id] } };
  }
};

const addRoomToUser = (id, roomName) => {
  const user = users[id];

  if (!user) {
    return USER_EXIST_ERROR;
  } else {
    user.rooms.push(roomName);
    return { user: { id, ...user } };
  }
};

const removeRoomFromUser = (id, roomName) => {
  const user = users[id];

  if (!user) {
    return USER_EXIST_ERROR;
  } else {
    user.rooms = user.rooms.filter((name) => name !== roomName);
    return { user: { id, ...user } };
  }
};

const getUser = (id) => {
  const user = users[id];
  if (!user) {
    return USER_EXIST_ERROR;
  } else {
    return { user: { id, ...user } };
  }
};

const getUsers = (ids) => {
  const usersByIds = ids.reduce((usersArray, userId) => {
    const user = users[userId];

    if (user !== undefined) {
      usersArray.push({ userId, ...user });
    }
    return usersArray;
  }, []);
  return { users: usersByIds };
};

const deleteUser = (id) => {
  delete users[id];
};

module.exports = {
  addUser,
  addRoomToUser,
  removeRoomFromUser,
  getUser,
  getUsers,
  deleteUser,
};
