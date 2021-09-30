import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { ChatManager, LandingPage } from "./pages";
import { UserContext } from "./context";

import "./App.css";

// Adding a comment to ensure deployment

const App = () => {
  const {
    user: { user },
  } = useContext(UserContext);
  return (
    <Router>
      <Route exact path='/' component={LandingPage} />
      <Route exact path='/chat' component={ChatManager} />
      <Redirect to={user !== "" ? "/chat" : "/"} />
    </Router>
  );
};

export default App;
