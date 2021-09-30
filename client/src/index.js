import React from "react";
import ReactDOM from "react-dom";

import App from "./App.jsx";
import { IoProvider, UserProvider } from "./context";

ReactDOM.render(
  <IoProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </IoProvider>,
  document.querySelector("#root")
);
