import React, { createContext, useReducer, useEffect, useContext } from "react";
import { IoContext } from ".";
import { useSound } from "../hooks";

const UserContext = createContext({
  user: {},
  dispatch: () => {},
  ACTION_TYPES: {},
});

const ACTION_TYPES = {
  ADD_NAME: "ADD_NAME",
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  ACTIVE_ROOM: "ACTIVE_ROOM",
  NOTIFICATION: "NOTIFICATION",
  LOGOUT: "LOGOUT",
};

const initialState = {
  user: "",
  rooms: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_NAME:
      return { ...state, user: action.payload };
    case ACTION_TYPES.JOIN_ROOM:
      return { ...state, rooms: [action.payload, ...state.rooms] };
    case ACTION_TYPES.LEAVE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.name !== action.payload),
      };
    case ACTION_TYPES.ACTIVE_ROOM:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.name === action.payload
            ? { ...room, notification: false, active: true }
            : { ...room, active: false }
        ),
      };
    case ACTION_TYPES.NOTIFICATION:
      const [notificationRooms, otherRooms] = state.rooms.reduce(
        (resultArray, currentRoom) => {
          if (currentRoom.name === action.payload) {
            currentRoom.notification = true;
            resultArray[0] = [currentRoom, ...resultArray[0]];
          } else if (!!currentRoom.notifcation) {
            resultArray[0].push(currentRoom);
          } else {
            resultArray[1].push(currentRoom);
          }
          return resultArray;
        },
        [[], []]
      );
      return { ...state, rooms: [...notificationRooms, ...otherRooms] };
    case ACTION_TYPES.LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};
const UserProvider = (props) => {
  const { socket } = useContext(IoContext);
  const [user, dispatch] = useReducer(reducer, initialState);

  const playNotification = useSound("notification.mp3");
  const playBlop = useSound("blop.mp3");

  useEffect(() => {
    if (!!socket) {
      socket.on("notification", (roomName) => {
        const room = user.rooms.find(({ name }) => name === roomName);
        if (!room.active) {
          dispatch({ type: ACTION_TYPES.NOTIFICATION, payload: roomName });
          playNotification();
        } else {
          playBlop();
        }
      });
      return () => {
        socket.off("notification");
      };
    }
  }, [socket, playNotification, playBlop, user.rooms]);
  return (
    <UserContext.Provider value={{ user, dispatch, ACTION_TYPES }} {...props} />
  );
};

export { UserContext, UserProvider };
