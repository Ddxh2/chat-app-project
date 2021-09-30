import React, { useContext, useMemo } from "react";
import ForumIcon from "@material-ui/icons/Forum";
import ExitIcon from "@material-ui/icons/ExitToApp";

import { ChatRoomsPanel, ChatPanel } from "../../components";
import { IoContext, UserContext } from "../../context";

import "./ChatManager.css";

const ChatManager = () => {
  const { socket } = useContext(IoContext);
  const { user, dispatch, ACTION_TYPES } = useContext(UserContext);

  const activeRoom = useMemo(() => {
    const room = user.rooms.find(({ active }) => !!active);
    return !!room ? room.name : "";
  }, [user]);

  const onLogOut = () => {
    socket.emit("logout", () => {
      dispatch({ type: ACTION_TYPES.LOGOUT });
    });
  };

  return (
    <div className='chatManager__outerContainer'>
      <div className='chatManager__titleContainer'>
        <div className='chatManager__title'>
          <ForumIcon fontSize='inherit' color='inherit' /> &nbsp; Get a Room
        </div>
        <div className='chatManager__logout'>
          <button className='button' onClick={onLogOut}>
            <div className='icon'>
              <ExitIcon fontSize='medium' color='inherit' />
            </div>
            Log Out
          </button>
        </div>
      </div>
      <div className='chatManager__innerContainer'>
        <ChatRoomsPanel />
        {activeRoom !== "" && <ChatPanel room={activeRoom} />}
      </div>
    </div>
  );
};

export default ChatManager;
