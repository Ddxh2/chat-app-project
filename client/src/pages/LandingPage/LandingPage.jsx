import React, { useState, useContext, useEffect, useRef } from "react";

import { IoContext, UserContext } from "../../context";

import "./LandingPage.css";

const LandingPage = () => {
  const { socket } = useContext(IoContext);
  const userContext = useContext(UserContext);

  const [error, setError] = useState(null);

  const nameRef = useRef();

  const onSignUpCallback = ({ error, user } = {}) => {
    if (!!error) {
      setError(error);
    } else {
      userContext.dispatch({
        type: userContext.ACTION_TYPES.ADD_NAME,
        payload: user.name,
      });
    }
  };

  const onSignUp = (event) => {
    event.preventDefault();

    if (nameRef.current.value !== "") {
      socket.emit("signUp", nameRef.current.value, onSignUpCallback);
    }
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <div className='landingPage__container'>
      <h1 className='landingPage__title'>Welcome!</h1>
      <h3 className='landingPage__subTitle'>Enter a Name to get Started</h3>
      <form action='' className='landingPage__form'>
        <input
          className={`landingPage__input ${!!error ? "inputError" : ""}`}
          type='text'
          id='name'
          name='name'
          ref={nameRef}
        />
        {!!error && <span className='inputError__message'>{error.user}</span>}
        <button
          className='landingPage__button'
          type='submit'
          onClick={onSignUp}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LandingPage;
