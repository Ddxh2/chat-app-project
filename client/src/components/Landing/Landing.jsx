import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Form } from "../";
import { FORMS } from "../../constants";
import { AuthContext, IoContext } from "../context";

import "./Landing.css";

const toProperCase = (string = "") => {
  if (string.length <= 1) {
    return string.toUpperCase();
  }
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const generatePassword = () => {
  let randomPassword = "";

  while (randomPassword.length < 6) {
    randomPassword += Math.ceil(Math.random() * 9).toString();
  }

  return randomPassword;
};

const Landing = (props) => {
  const { socket } = useContext(IoContext);
  const auth = useContext(AuthContext);

  const history = useHistory();

  const [form, setForm] = useState(FORMS.JOIN);
  const [errors, setErrors] = useState({});
  const onHeaderClick = (event) =>
    setForm(FORMS[event.target.innerHTML.toUpperCase()]);

  const onSubmit = (values) => {
    if (!!socket) {
      if (form === FORMS.OPEN) {
        const password = generatePassword();
        values = { ...values, password };
      }
      socket.emit(
        form === FORMS.OPEN ? "open" : "join",
        values,
        ({ error } = {}) => {
          if (!!error) {
            setErrors(error);
          } else {
            auth.joinRoom(values.room, values.password);
            history.push(`/chat?name=${values.name}&room=${values.room}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(errors);
    }
  }, [errors]);

  return (
    <div className='landing__container'>
      <div className='landing__headers'>
        {Object.keys(FORMS).map((key) => (
          <h1
            className={`landing__header ${
              form === key ? "landing__header__selected" : ""
            }`}
            key={key}
            name={key}
            onClick={onHeaderClick}
          >
            {toProperCase(key)}
          </h1>
        ))}
      </div>
      <Form formType={form} onSubmit={onSubmit} errors={errors} />
    </div>
  );
};

export default Landing;
