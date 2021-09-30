import React, { useState, useContext, useMemo, useEffect } from "react";
import moment from "moment";

import { IoContext, UserContext } from "../../context";
import { MESSAGE_TYPES } from "../../constants";
import { Modal } from "..";

import "./RoomDetails.css";

const RoomDetails = () => {
  const { socket } = useContext(IoContext);
  const { user } = useContext(UserContext);

  const [roomData, setRoomData] = useState({});
  const [selectedImage, setSelectedImage] = useState({});

  const activeRoom = useMemo(() => {
    const room = user.rooms.find(({ active }) => !!active);
    return !!room ? room.name : "";
  }, [user]);

  const [passcode, users, imageMessages] = useMemo(() => {
    if (Object.keys(roomData).length === 0) {
      return ["", [], []];
    }
    const { passcode, users: usersInRoom, messages } = roomData;

    const usernames = usersInRoom.map(({ name }) => name);
    const images = messages.filter(({ type }) => type === MESSAGE_TYPES.IMAGE);
    return [passcode, usernames, images];
  }, [roomData]);

  useEffect(() => {
    if (!!socket) {
      socket.emit("getRoomData", activeRoom, (roomData) =>
        setRoomData(roomData)
      );
    }
  }, [socket, activeRoom]);

  return (
    <>
      <Modal
        isShown={Object.keys(selectedImage).length !== 0}
        onClose={() => setSelectedImage({})}
        title={`Sent ${moment(selectedImage.createdAt).fromNow()}`}
        size='LARGE'
      >
        <img
          className='roomDetails__modalImage'
          alt='modalImage'
          src={selectedImage.content}
        />
      </Modal>
      <div className='roomDetails__container'>
        <div className='roomDetails__statsSection'>
          <table>
            <tbody>
              <tr>
                <td className='roomDetails__tableCell roomDetails__tableCell__leftAlign'>
                  Passcode:
                </td>
                <td className='roomDetails__tableCell'>{passcode}</td>
              </tr>
              <tr>
                <td className='roomDetails__tableCell roomDetails__tableCell__leftAlign'>
                  # Users:
                </td>
                <td className='roomDetails__tableCell'>{users.length}</td>
              </tr>
              <tr>
                <td className='roomDetails__tableCell roomDetails__tableCell__leftAlign'>
                  # Messages:
                </td>
                <td className='roomDetails__tableCell'>
                  {!!roomData.messages && roomData.messages.length}
                </td>
              </tr>
              <tr>
                <td className='roomDetails__tableCell roomDetails__tableCell__leftAlign'>
                  # Images:
                </td>
                <td className='roomDetails__tableCell'>
                  {imageMessages.length}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='roomDetails__listsSection'>
          <div className='roomDetails__list'>
            <div className='roomDetails__listHeader'>Users</div>
            {!!users &&
              !!users.length &&
              users.map((user) => (
                <div className='roomDetails__list__user' key={user}>
                  {user}
                </div>
              ))}
          </div>
          <div className='roomDetails__list'>
            <div className='roomDetails__listHeader'>Images</div>
            {!!imageMessages &&
              !!imageMessages.length &&
              imageMessages.map(({ content, createdAt, authorId }) => (
                <div
                  className='roomDetails__listImage__container'
                  onClick={() => setSelectedImage({ content, createdAt })}
                  key={`${authorId}-${createdAt}`}
                >
                  <img
                    src={content}
                    alt={`${authorId}-${createdAt}`}
                    className='roomDetails__listImage'
                  />
                  <span className='roomDetails__listImage__timestamp'>
                    Sent {moment(createdAt).fromNow()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
