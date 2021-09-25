import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Chat, Landing } from "./components";
import { IoProvider, AuthProvider } from "./components/context";

import "./App.css";

const App = () => (
  <IoProvider>
    <AuthProvider>
      <Router>
        <Route exact path='/' component={Landing} />
        <Route exact path='/chat' component={Chat} />
      </Router>
    </AuthProvider>
  </IoProvider>
);

export default App;
