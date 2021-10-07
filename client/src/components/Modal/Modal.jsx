import React, { useState, useEffect } from "react";
import ReactEmoji from "react-emoji";
import CloseIcon from "@material-ui/icons/Close";

import "./Modal.css";

const MODAL_SIZES = { SMALL: "small", MEDIUM: "medium", LARGE: "large" };

const Modal = ({
  isShown,
  showHeader = true,
  onClose = () => {},
  size,
  title,
  children,
}) => {
  const [show, setShow] = useState(isShown);

  const handleClose = (event) => {
    event?.stopPropagation?.();
    setShow(false);
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" || event.code === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    setShow(isShown);
  }, [isShown]);

  useEffect(() => {
    if (!!show) {
      console.log("listener added");
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        console.log("listener removed");

        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [show]);

  return !!show ? (
    <div className='modal__overlay' onClick={handleClose}>
      <div
        className={`modal__container modal__container__${MODAL_SIZES[size]}`}
        onClick={(event) => event.stopPropagation()}
      >
        {!!showHeader && (
          <div className='modal__header'>
            <span className='modal__title'>{ReactEmoji.emojify(title)}</span>
            <div className='icon' onClick={handleClose}>
              <CloseIcon fontSize='medium' color='inherit' />
            </div>
          </div>
        )}
        <div className='modal__body'>{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
