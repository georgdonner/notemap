import { useEffect } from "react";
import { FirebaseAppProvider } from "reactfire";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSigninCheck, useFirestore } from "reactfire";

import { PrivateRoute, PublicRoute } from "./components/auth/routes";

import MapList from "./components/maps-list/MapList";
import MapForm from "./components/maps-list/MapForm";
import MainMap from "./components/map/MainMap";
import SingleMap from "./components/map/SingleMap";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import "./App.css";

const firebaseProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${firebaseProjectId}pwa-notemap.firebaseapp.com`,
  projectId: firebaseProjectId,
  storageBucket: `${firebaseProjectId}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <MainRouter />
    </FirebaseAppProvider>
  );
}

function MainRouter() {
  const { status, data: signInCheckResult } = useSigninCheck();
  const isAuthenticated = signInCheckResult?.signedIn;

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
      console.warn(message);
    }
  }, [firestore]);

  return status === "loading" ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <Router>
      <div className="App">
        <Switch>
          <PublicRoute path="/login" isAuthenticated={isAuthenticated}>
            <LoginForm />
          </PublicRoute>
          <PublicRoute path="/signup" isAuthenticated={isAuthenticated}>
            <SignupForm />
          </PublicRoute>
          <PrivateRoute path="/new-map" isAuthenticated={isAuthenticated}>
            <MapForm />
          </PrivateRoute>
          <PrivateRoute path="/main-map" isAuthenticated={isAuthenticated}>
            <MainMap />
          </PrivateRoute>
          <PrivateRoute path="/map/:id/edit" isAuthenticated={isAuthenticated}>
            <MapForm />
          </PrivateRoute>
          <PrivateRoute path="/map/:id" isAuthenticated={isAuthenticated}>
            <SingleMap />
          </PrivateRoute>
          <PrivateRoute path="/" isAuthenticated={isAuthenticated}>
            <MapList />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
