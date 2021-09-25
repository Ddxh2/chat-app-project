const messages = {};

const addMessageToRoom = (room, message) => {
  messages[room] = [...(messages[room] || []), message];
  return message;
};

const getMessagesInRoom = (room) => {
  const roomMessages = messages[room];
  return roomMessages || [];
};

const clearMessagesFromRoom = (room) => {
  delete messages[room];
};

module.exports = { addMessageToRoom, getMessagesInRoom, clearMessagesFromRoom };
