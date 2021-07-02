import React from "react";
import ReactDOM from "react-dom";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";

import "./index.css";
import App from "./components/app";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
