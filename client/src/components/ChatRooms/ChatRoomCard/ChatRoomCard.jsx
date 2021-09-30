import React, { useContext } from "react";
import ReactEmoji from "react-emoji";
import CloseIcon from "@material-ui/icons/Close";

import { UserContext, IoContext } from "../../../context";

import "./ChatRoomCard.css";

const ChatRoomCard = ({ room, onSelect }) => {
  const { socket } = useContext(IoContext);
  const { dispatch, ACTION_TYPES } = useContext(UserContext);

  const { name, notification, active } = room;

  const handleLeaveRoom = () => {
    socket.emit("leave", name, leaveRoomCallback);
  };

  const leaveRoomCallback = ({ error }) => {
    if (!!error) {
      console.log(error);
    } else {
      dispatch({ type: ACTION_TYPES.LEAVE_ROOM, payload: name });
    }
  };

  return (
    <div
      className={`chatRoomCard__container ${
        !!active ? "chatRoomCard__container__active" : ""
      }`}
      onClick={onSelect}
    >
      <div className='chatRoomCard__left'>
        {!!notification && <div className='chatRoomCard__notification' />}
        <div className='chatRoomCard__text'>
          <span className='chatRoomCard__roomName'>
            {ReactEmoji.emojify(name)}
          </span>
        </div>
      </div>
      <div className='chatRoomCard__right'>
        <div className='icon' onClick={handleLeaveRoom}>
          <CloseIcon fontSize='medium' color='inherit' />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomCard;
