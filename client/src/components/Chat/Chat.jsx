import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import queryString from "query-string";

import { InfoBar, Input, Messages } from "../";
import { IoContext, AuthContext } from "../context";

import "./Chat.css";

const Chat = () => {
  const { socket } = useContext(IoContext);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!!message) {
      socket.emit("sendMessage", message, ({ error } = {}) => {
        if (!!error) {
          console.log(error);
        } else {
          setMessage("");
        }
      });
    }
  };
  useEffect(() => {
    if (!!socket) {
      const { name, room } = queryString.parse(window.location.search);
      const password = auth.rooms[room];

      if (!password) {
        history.push("/");
      } else {
        setName(name);
        setRoom(room);
        setPassword(password);

        socket.emit("joined", ({ error }) => {
          if (!!error) {
            console.log(error);
          }
        });
      }
    }
  }, [socket, auth, history]);

  useEffect(() => {
    if (!!socket) {
      socket.on("getPreviousMessages", (messages) => setMessages(messages));
    }
  }, [socket]);

  useEffect(() => {
    if (!!socket) {
      socket.on("message", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  return (
    <div className='chat__outerContainer'>
      <div className='chat__innerContainer'>
        <InfoBar room={room} password={password} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
