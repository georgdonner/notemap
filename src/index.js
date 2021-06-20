import React from "react";
import ReactDOM from "react-dom";
import "firebase/auth";
import "firebase/firestore";

import "./index.css";
import App from "./App";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const sw = `${window.location.origin}/serviceWorker.js`;
    navigator.serviceWorker.register(sw).catch(function (err) {
      console.log("Service worker registration failed", err);
    });
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
