import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";

import { Details } from "../";

import "./InfoBar.css";

const InfoBar = ({ room, password }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <Details
        isShown={showDetails}
        room={room}
        password={password}
        onCloseCallback={() => setShowDetails(false)}
      />
      <div className='infoBar'>
        <div className='infoBar__leftInnerContainer'>
          <div className='infoBar__onlineIcon' />
          <h3>{room}</h3>
        </div>
        <div className='infoBar__rightInnerContainer'>
          <SettingsIcon
            className='infoBar__detailsIcon'
            onClick={() => setShowDetails(true)}
          />

          <a href='/' className='infoBar__closeIcon'>
            <CloseIcon />
          </a>
        </div>
      </div>
    </>
  );
};

export default InfoBar;
