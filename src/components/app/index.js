import { useEffect, useState, useContext } from "react";
import { FirebaseAppProvider } from "reactfire";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useFirestore } from "reactfire";
import firebase from "firebase/app";

import { PrivateRoute, PublicRoute } from "../auth/routes";
import SidebarContext from "../../context/sidebar";
import AuthContext from "../../context/auth";
import useUserState from "../../hooks/useUserState";

import PushMessaging from "./PushMessaging";
import MapList from "../maps-list/MapList";
import MapForm from "../maps-list/MapForm";
import MainMap from "../map/MainMap";
import SingleMap from "../map/SingleMap";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Loader from "../common/Loader";
import "./index.css";

const firebaseProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${firebaseProjectId}pwa-notemap.firebaseapp.com`,
  projectId: firebaseProjectId,
  storageBucket: `${firebaseProjectId}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const sw = `${process.env.PUBLIC_URL}/serviceWorker.js`;
    navigator.serviceWorker.register(sw).catch(function (err) {
      console.log("Service worker registration failed", err);
    });
  });
}

function MainRouter() {
  const { user } = useContext(AuthContext);
  const [sidebar, setSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      <Router>
        {user && firebase.messaging.isSupported() ? (
          <PushMessaging user={user} />
        ) : null}
        <div className="App">
          <Switch>
            <PublicRoute path="/login" component={LoginForm} />
            <PublicRoute path="/signup" component={SignupForm} />
            <PrivateRoute path="/new-map" component={MapForm} />
            <PrivateRoute path="/main-map" component={MainMap} />
            <PrivateRoute path="/map/:id/edit" component={MapForm} />
            <PrivateRoute path="/map/:id" component={SingleMap} />
            <PrivateRoute path="/" component={MapList} />
          </Switch>
        </div>
      </Router>
    </SidebarContext.Provider>
  );
}

function Init() {
  const userState = useUserState();

  const firestore = useFirestore();

  useEffect(() => {
    try {
      firestore.enablePersistence();
    } catch (error) {
      let message = "Firebase offline mode not enabled.";
      if (error.code === "failed-precondition") {
        message += " Can only be enabled in one tab at a time";
      } else if (error.code === "unimplemented") {
        message += " Browser does not support all of the required features";
      }
      console.warn(message, error);
    }
  }, [firestore]);

  return userState.loading ? (
    <Loader />
  ) : (
    <AuthContext.Provider value={userState}>
      <MainRouter />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Init />
    </FirebaseAppProvider>
  );
}

export default App;
