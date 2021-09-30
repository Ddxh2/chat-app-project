import React, { useState, useEffect, useContext } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ReactEmoji from "react-emoji";

import { ChatRooms, Modal, Form } from "..";
import { FORMS } from "../../constants";
import { UserContext } from "../../context";

import "./ChatRoomsPanel.css";

const toProperCase = (string = "") => {
  if (string.length <= 1) {
    return string.toUpperCase();
  }
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const ChatRoomsPanel = () => {
  const {
    user: { user: name, rooms },
  } = useContext(UserContext);

  const [displayedRooms, setDisplayedRooms] = useState([...rooms]);
  const [filter, setFilter] = useState("");
  const [formInfo, setFormInfo] = useState({ showForm: false, formType: null });

  useEffect(() => {
    setDisplayedRooms([...rooms]);
    setFilter("");
  }, [rooms]);

  useEffect(() => {
    if (filter === "") {
      setDisplayedRooms(rooms);
    } else {
      setDisplayedRooms(
        rooms.filter(({ name }) =>
          name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, rooms]);

  return (
    <>
      <Modal
        isShown={formInfo.showForm}
        onClose={() => setFormInfo({ showForm: false, formType: null })}
        size='MEDIUM'
        title={toProperCase(formInfo.formType || "") + " Room"}
      >
        <Form
          formType={formInfo.formType}
          onSubmit={() => setFormInfo({ showForm: false, formType: null })}
        />
      </Modal>
      <div className='chatRoomsPanel__container'>
        <div className='chatRoomsPanel__toolbar'>
          <h4 className='chatRoomsPanel__toolbar__header'>
            {ReactEmoji.emojify(name)}'s Rooms
          </h4>
          <div className='chatRoomsPanel__toolbar__buttons'>
            <button
              className='button'
              onClick={() =>
                setFormInfo({ showForm: true, formType: FORMS.JOIN })
              }
            >
              <div className='icon'>
                <MeetingRoomIcon fontSize='medium' color='inherit' />
              </div>
              Join Room
            </button>
            <button
              className='button'
              onClick={() =>
                setFormInfo({ showForm: true, formType: FORMS.OPEN })
              }
            >
              <div className='icon'>
                <AddIcon fontSize='medium' color='inherit' />
                Open Room
              </div>
            </button>
          </div>
        </div>
        <div className='chatRoomsPanel__searchContainer'>
          <input
            className='chatRoomsPanel__searchBar'
            placeholder='Search Room by Name...'
            type='text'
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          ></input>
          <div className='icon'>
            <SearchIcon fontSize='medium' color='inherit' />
          </div>
        </div>
        <div className='chatRoomsPanel__chatRooms'>
          {!!displayedRooms && <ChatRooms rooms={displayedRooms} />}
        </div>
      </div>
    </>
  );
};

export default ChatRoomsPanel;
