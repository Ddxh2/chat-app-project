import React, { useState, useRef, useContext } from "react";
import ReactEmoji from "react-emoji";
import SendIcon from "@material-ui/icons/Send";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import ImageIcon from "@material-ui/icons/Image";
import FileBase from "react-file-base64";

import { useRandomGradient } from "../../hooks";
import { IoContext } from "../../context";
import { Messages, Modal, RoomDetails, Prompt } from "../";
import { MESSAGE_TYPES } from "../../constants";

import "./ChatPanel.css";

const ChatPanel = ({ room }) => {
  const { socket } = useContext(IoContext);

  const [imageMessage, setImageMessage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const randomGradient = useRandomGradient();

  const messageRef = useRef();

  const onImageIconClick = () => {
    const fileUploadElement = document.querySelector(
      ".chatPanel__imageUpload > input"
    );
    fileUploadElement.click();
  };

  const onSubmit = () => {
    if (!!imageMessage || messageRef.current.value.trim() !== "") {
      const message = !!imageMessage
        ? {
            type: MESSAGE_TYPES.IMAGE,
            content: imageMessage,
            authorId: socket.id,
            createdAt: new Date().toISOString(),
          }
        : {
            type: MESSAGE_TYPES.TEXT,
            content: messageRef.current.value,
            authorId: socket.id,
            createdAt: new Date().toISOString(),
          };

      socket.emit(
        "sendMessage",
        room,
        message,
        ({ message: { type } = {} } = {}) => {
          if (type === MESSAGE_TYPES.IMAGE) {
            setImageMessage(null);
          } else if (type === MESSAGE_TYPES.TEXT) {
            messageRef.current.value = "";
          }
        }
      );
    }
  };

  return (
    <>
      <Modal
        title={`${room} Details`}
        size='LARGE'
        isShown={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      >
        <RoomDetails />
      </Modal>
      <Prompt targetElementId={"roomDetailsIcon"} />
      <div className='chatPanel__container'>
        <div className='chatPanel__header'>
          <span>{ReactEmoji.emojify(room)}</span>
          <div
            id='roomDetailsIcon'
            className='icon'
            onClick={() => setShowDetailsModal(true)}
          >
            <MoreIcon fontSize='medium' color='inherit' />
          </div>
        </div>
        <div
          className='chatPanel__body'
          style={{
            backgroundImage: `url(${randomGradient})`,
            backgroundSize: "cover",
          }}
        >
          <Messages room={room} />
        </div>
        <footer className='chatPanel__footer'>
          <div className='chatPanel__imageUpload'>
            <FileBase
              type='file'
              multiple={false}
              onDone={({ base64 }) => setImageMessage(base64)}
            />
          </div>
          <div className='icon'>
            <ImageIcon
              fontSize='large'
              color='inherit'
              onClick={onImageIconClick}
            />
          </div>
          <div className='chatPanel__messageContainer'>
            {!!imageMessage ? (
              <img
                className='chatPanel__image'
                alt='message'
                src={imageMessage}
                onClick={() => setImageMessage(null)}
              />
            ) : (
              <textarea
                type='text'
                className='chatPanel__input'
                ref={messageRef}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmit();
                  }
                }}
              />
            )}
          </div>
          <button className='chatPanel__submit' onClick={onSubmit}>
            <SendIcon fontSize='small' color='inherit' />
          </button>
        </footer>
      </div>
    </>
  );
};

export default ChatPanel;
