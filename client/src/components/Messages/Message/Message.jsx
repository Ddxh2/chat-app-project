import React, { useState, useContext } from "react";
import ReactEmoji from "react-emoji";
import moment from "moment";

import { Modal } from "../../";
import { IoContext } from "../../../context";
import { MESSAGE_TYPES } from "../../../constants";

import "./Message.css";

const Message = ({ message = {} }) => {
  const { socket } = useContext(IoContext);

  const { type, content, authorId, createdAt } = message;

  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <Modal
        isShown={showImageModal}
        title={`Sent ${moment(createdAt).fromNow()}`}
        onClose={() => setShowImageModal(false)}
        size='LARGE'
      >
        <img
          className='message__modalImage'
          alt='modal-message'
          src={content}
        />
      </Modal>

      <div
        className={`message__container ${
          type === MESSAGE_TYPES.ADMIN
            ? "justifyCenter"
            : authorId === socket.id
            ? "justifyEnd"
            : "justifyStart"
        }`}
      >
        {type === MESSAGE_TYPES.ADMIN ? (
          <div className='message__body__admin'>
            <span>{ReactEmoji.emojify(content)}</span>
          </div>
        ) : (
          <div className='message__body__container'>
            <div
              className={`message__body ${
                authorId === socket.id ? "message__body__user" : ""
              }`}
            >
              {type === MESSAGE_TYPES.IMAGE ? (
                <img
                  className='message__image'
                  alt={`message-${authorId}-${createdAt}`}
                  src={content}
                  onClick={() => setShowImageModal(true)}
                />
              ) : (
                <p>{ReactEmoji.emojify(content)}</p>
              )}
            </div>
            <span className='message__timestamp'>
              Sent {moment(createdAt).fromNow()}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Message;
