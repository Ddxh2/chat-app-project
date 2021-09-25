import React, { useState, useEffect } from "react";

import "./Details.css";

const Details = ({ room, password, isShown, onCloseCallback }) => {
  const [show, setShow] = useState(isShown);

  const onClose = () => {
    onCloseCallback();
    setShow(false);
  };

  useEffect(() => {
    setShow(isShown);
  }, [isShown]);

  return (
    <div
      className={`details__overlay ${
        !!show ? "details__shown" : "details__hidden"
      }`}
      onClick={onClose}
    >
      <div
        className='details__panel'
        onClick={(event) => event.stopPropagation()}
      >
        <table>
          <tbody>
            <tr>
              <td className='details__cell'>Room Name: </td>
              <td className='details__cell'>{room}</td>
            </tr>
            <tr>
              <td className='details__cell'>Room Password: </td>
              <td className='details__cell'>{password}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Details;
