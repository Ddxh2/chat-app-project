import React, { useState, useEffect, useContext, useRef } from "react";

import { FORMS } from "../../constants";
import { IoContext, UserContext } from "../../context";

import "./Form.css";

const generatePasscode = () => {
  let randomPasscode = "";

  while (randomPasscode.length < 6) {
    randomPasscode += Math.ceil(Math.random() * 9).toString();
  }

  return randomPasscode;
};

const Form = ({ onSubmit, formType }) => {
  const { socket } = useContext(IoContext);
  const { dispatch, ACTION_TYPES } = useContext(UserContext);

  const [values, setValues] = useState({ passcode: "", name: "" });
  const [errors, setErrors] = useState({});

  const roomNameRef = useRef();

  const onChange = (event) =>
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    let formValues = { ...values };

    if (!!socket) {
      if (formType === FORMS.OPEN) {
        const passcode = generatePasscode();
        formValues = { ...formValues, passcode };
      }
      socket.emit(
        formType === FORMS.OPEN ? "open" : "join",
        formValues,
        ({ error } = {}) => {
          if (!!error) {
            setErrors(error);
          } else {
            if (!!onSubmit) {
              onSubmit();
            }
            dispatch({
              type: ACTION_TYPES.JOIN_ROOM,
              payload: {
                ...formValues,
                notification: false,
              },
            });
            dispatch({
              type: ACTION_TYPES.ACTIVE_ROOM,
              payload: formValues.name,
            });
            setTimeout(() => {
              setValues({ name: "", passcode: "" });
            });
          }
        }
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const submitButton = document.querySelector(".form__button");
      submitButton.click();
    }
  };

  useEffect(() => {
    roomNameRef.current.focus();
  }, []);
  return (
    <div className='form__container'>
      {!!errors.user && <span className='form__error'>{errors.user}</span>}
      <div className='form__inputContainer'>
        <input
          placeholder='Enter the room name...'
          className={`form__input mt-20 ${
            !!errors.room ? "form__input__error" : ""
          }`}
          type='text'
          id='name'
          name='name'
          ref={roomNameRef}
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />
        {!!errors.room && <span className='form__error'>{errors.room}</span>}
      </div>
      {formType === FORMS.JOIN && (
        <div className='form__inputContainer'>
          <input
            placeholder='Enter the room passcode...'
            className={`form__input mt-20 ${
              !!errors.passcode ? "form__input__error" : ""
            }`}
            type='password'
            id='passcode'
            name='passcode'
            onChange={onChange}
            onKeyPress={handleKeyPress}
          />
          {!!errors.passcode && (
            <span className='form__error'>{errors.passcode}</span>
          )}
        </div>
      )}
      <button
        className='form__button mt-20'
        type='submit'
        onClick={handleSubmit}
        disabled={
          formType === FORMS.JOIN
            ? Object.values(values).some((value) => value === "")
            : values.name === ""
        }
      >
        {formType === FORMS.OPEN ? "Create Room" : "Join Room"}
      </button>
    </div>
  );
};

export default Form;
