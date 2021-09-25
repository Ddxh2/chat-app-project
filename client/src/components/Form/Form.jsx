import React, { useState } from "react";

import { FORMS } from "../../constants";

import "./Form.css";

const Form = ({ onSubmit, errors, formType }) => {
  const [values, setValues] = useState({});

  const onChange = (event) =>
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  return (
    <div className='form__container'>
      <div>
        <input
          placeholder='Enter your name...'
          className={`form__input ${!!errors.name ? "form__input__error" : ""}`}
          type='text'
          id='name'
          name='name'
          onChange={onChange}
        />
        {!!errors.name && <span className='form__error'>{errors.name}</span>}
      </div>
      <div>
        <input
          placeholder='Enter the room name...'
          className={`form__input mt-20 ${
            !!errors.room ? "form__input__error" : ""
          }`}
          type='text'
          id='room'
          name='room'
          onChange={onChange}
        />
        {!!errors.room && <span className='form__error'>{errors.room}</span>}
      </div>
      {formType === FORMS.JOIN && (
        <div>
          <input
            placeholder='Enter the room password...'
            className={`form__input mt-20 ${
              !!errors.password ? "form__input__error" : ""
            }`}
            type='password'
            id='password'
            name='password'
            onChange={onChange}
          />
          {!!errors.password && (
            <span className='form__error'>{errors.password}</span>
          )}
        </div>
      )}

      <button
        className='form__button mt-20'
        type='submit'
        onClick={() => onSubmit(values)}
        disabled={Object.values(values).every((value) => value === "")}
      >
        {formType === FORMS.OPEN ? "Create Room" : "Join Room"}
      </button>
    </div>
  );
};

export default Form;
