const users = [];

const addUser = ({ id, name, room }) => {
  // Format room name
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (!!existingUser) {
    return { error: { name: "Username is taken" } };
  }

  const user = { id, name, room };

  users.push(user);
  return {};
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    const removedUser = users.splice(index, 1)[0];
    const numRemainingUsers = users.length;
    return { user: removedUser, numRemainingUsers };
  }
  return {};
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
