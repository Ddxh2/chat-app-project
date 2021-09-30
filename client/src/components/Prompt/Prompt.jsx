import React, { useState, useEffect } from "react";

import "./Prompt.css";

const Prompt = ({ targetElementId }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClose = () => {
    setShowPrompt(false);
  };

  const handleBodyClick = (event) => {
    event.stopPropagation();
  };

  const handleDontShowAgain = (event) => {
    if (!!event.target.checked) {
      localStorage.setItem("showPasscodePrompt", false);
    } else {
      // actively unchecked
      localStorage.removeItem("showPasscodePrompt");
    }
  };

  useEffect(() => {
    const shouldShow = localStorage.getItem("showPasscodePrompt");
    if (shouldShow == null) {
      // localStorage value not set --> first time
      setShowPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (!!showPrompt && !!targetElementId) {
      const targetElement = document.querySelector(`#${targetElementId}`);
      const { width, height } = targetElement.getBoundingClientRect();
      const { offsetLeft: left, offsetTop: top } = targetElement;
      const leftPosition = left + width;
      const topPosition = top + height + 5;

      setPosition({ top: topPosition, left: leftPosition });
    }
  }, [showPrompt, targetElementId]);

  return !!showPrompt ? (
    <div className='prompt__overlay' onClick={handleClose}>
      <div
        className='promt__container'
        style={{
          position: "absolute",
          left: `${position.left}px`,
          top: `${position.top}px`,
        }}
        onClick={handleBodyClick}
      >
        <p className='prompt__body'>Check your room passcode here</p>
        <input
          type='checkbox'
          className='prompt__checkbox'
          id='showAgain'
          name='showAgain'
          onChange={handleDontShowAgain}
        />
        <label htmlFor='showAgain'>Don't show again</label>
        <div className='prompt__tail'></div>
      </div>
    </div>
  ) : null;
};

export default Prompt;
