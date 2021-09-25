import React from "react";
import ReactEmoji from "react-emoji";

import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  const isSentByCurrentUser = (name.trim() || "").toLowerCase() === user;
  return user.toLowerCase() === "admin" ? (
    <div className='message__adminMessage__container'>
      <p className='message__adminMessage'>{text}</p>
      <hr />
    </div>
  ) : isSentByCurrentUser ? (
    <div className='message__container justifyEnd'>
      <p className='message__sender pr-10'>{user}</p>
      <div className='message__box backgroundBlue'>
        <p className='message__text colorWhite'>{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className='message__container justifyStart'>
      <div className='message__box backgroundLight'>
        <p className='message__text colorDark'>{ReactEmoji.emojify(text)}</p>
      </div>
      <p className='message__sender pl-10'>{user}</p>
    </div>
  );
};

export default Message;
