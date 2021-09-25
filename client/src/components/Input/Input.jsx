import React from "react";

import "./Input.css";

const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <form className='input__form'>
      <input
        className='input__input'
        type='text'
        placeholder='Type a message...'
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
      />
      <button
        className='input__sendButton'
        onClick={(event) => sendMessage(event)}
      >
        Send
      </button>
    </form>
  );
};

export default Input;
