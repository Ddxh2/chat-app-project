import React, { useState, useEffect, createContext } from "react";
import io from "socket.io-client";

const IoContext = createContext({
  socket: null,
});

const IoProvider = (props) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connectedSocket = io(process.env.REACT_APP_ENDPOINT);
    setSocket(connectedSocket);
    return () => {
      connectedSocket.emit("disconnect");
      connectedSocket.off();
    };
  }, []);
  return <IoContext.Provider value={{ socket }} {...props} />;
};

export { IoContext, IoProvider };
