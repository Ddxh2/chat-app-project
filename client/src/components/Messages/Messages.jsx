import React, { useState, useRef, useContext, useEffect } from "react";

import Message from "./Message/Message";
import { IoContext } from "../../context";

import "./Messages.css";

const Messages = ({ room }) => {
  const { socket } = useContext(IoContext);

  const [messages, setMessages] = useState([]);

  const messagesRef = useRef();

  useEffect(() => {
    if (!!socket) {
      socket.emit("joined", room, ({ messages: previousMessages = [] }) =>
        setMessages([...previousMessages])
      );

      socket.on("message", (message, roomName) => {
        if (roomName === room) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        socket.off("message");
      };
    }
  }, [room, socket]);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);
  return (
    <div className='messages__container' ref={messagesRef}>
      {!!messages &&
        !!messages.length &&
        messages.map((message, index) => (
          <Message message={message} key={index} />
        ))}
    </div>
  );
};

export default Messages;
