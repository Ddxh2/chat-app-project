import React, { useContext } from "react";

import ChatRoomCard from "./ChatRoomCard/ChatRoomCard";
import { UserContext } from "../../context";

import "./ChatRooms.css";

const ChatRooms = ({ rooms }) => {
  const { dispatch, ACTION_TYPES } = useContext(UserContext);

  return (
    <div className='chatRooms__container'>
      {!!rooms &&
        !!rooms.length &&
        rooms.map((room) => (
          <ChatRoomCard
            key={room.name}
            room={room}
            onSelect={() =>
              dispatch({ type: ACTION_TYPES.ACTIVE_ROOM, payload: room.name })
            }
          />
        ))}
    </div>
  );
};

export default ChatRooms;
