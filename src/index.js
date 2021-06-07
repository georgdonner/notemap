import React from "react";
import ReactDOM from "react-dom";
import "firebase/auth";
import "firebase/firestore";
import "bootstrap/dist/css/bootstrap.css";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
