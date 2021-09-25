import React, { useState, createContext } from "react";

const AuthContext = createContext({
  rooms: {},
  joinRoom: () => {},
  leaveRoom: () => {},
});

const AuthProvider = (props) => {
  const [rooms, setRooms] = useState({});

  const joinRoom = (room, password) =>
    setRooms((prev) => ({ ...prev, [room]: password }));
  const leaveRoom = (room) =>
    setRooms((prev) => {
      const copy = { ...prev };
      delete copy[room];
      return copy;
    });

  return (
    <AuthContext.Provider value={{ rooms, joinRoom, leaveRoom }} {...props} />
  );
};

export { AuthContext, AuthProvider };
