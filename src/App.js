import { useEffect, useState } from "react";
import { FirebaseAppProvider } from "reactfire";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSigninCheck, useFirestore, useMessaging } from "reactfire";
import { Toast, ToastContainer } from "react-bootstrap";
import firebase from "firebase/app";

import { PrivateRoute, PublicRoute } from "./components/auth/routes";
import SidebarContext from "./context/sidebar";

import MapList from "./components/maps-list/MapList";
import MapForm from "./components/maps-list/MapForm";
import MainMap from "./components/map/MainMap";
import SingleMap from "./components/map/SingleMap";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import NavbarComp from "./components/common/NavbarComp";
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const sw = `${process.env.PUBLIC_URL}/serviceWorker.js`;
    navigator.serviceWorker.register(sw).catch(function (err) {
      console.log("Service worker registration failed", err);
    });
  });
}

function PushMessaging({ user }) {
  const messaging = useMessaging();
  const firestore = useFirestore();
  const { FieldValue } = useFirestore;

  const [token, setToken] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [notification, setNotification] = useState();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getToken = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const serviceWorkerRegistration = await navigator.serviceWorker.ready;
          const currentToken = await messaging.getToken({
            vapidKey: process.env.REACT_APP_FCM_PUSH_KEY,
            serviceWorkerRegistration,
          });
          if (!currentToken) {
            throw new Error("No token received");
          }

          firestore
            .collection("users")
            .doc(user.uid)
            .update({
              messagingTokens: FieldValue.arrayUnion(currentToken),
            });

          setToken(currentToken);
        } catch (error) {
          console.log("Could not get FCM messaging token", error);
        }
      }
    };

    getToken();

    const unsubscribe = messaging.onMessage((payload) => {
      setNotification(payload.notification);
      setShowToast(true);
    });

    return () => {
      unsubscribe();
    };
  }, [messaging, firestore, FieldValue, user]);

  if (!token || !notification) {
    return null;
  }

  return (
    <ToastContainer position="top-end">
      <Toast show={showToast} onClose={() => setShowToast(false)}>
        <Toast.Header>
          {notification.image ? (
            <img
              src={notification.image}
              className="rounded me-2"
              alt=""
              style={{ maxWidth: "100px" }}
            />
          ) : null}
          <strong className="me-auto">{notification.title}</strong>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

function MainRouter() {
  const { status, data: signInCheckResult } = useSigninCheck();
  const isAuthenticated = signInCheckResult?.signedIn;

  const [sidebar, setSidebar] = useState(false);

  const firestore = useFirestore();

  useEffect(() => {
    firestore.enablePersistence().catch((error) => {
      let message = "Firebase offline mode not enabled.";
      if (error.code === "failed-precondition") {
        message += " Can only be enabled in one tab at a time";
      } else if (error.code === "unimplemented") {
        message += " Browser does not support all of the required features";
      }
      console.warn(message);
    });
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
    <SidebarContext.Provider value={{ sidebar, setSidebar }}>
      <Router>
        <PushMessaging user={signInCheckResult.user} />
        {firebase.messaging.isSupported() ? (
          <PushMessaging user={signInCheckResult.user} />
        ) : null}
        <div className="App">
          <Switch>
            <PublicRoute path="/login" isAuthenticated={isAuthenticated}>
              <LoginForm />
            </PublicRoute>
            <PublicRoute path="/signup" isAuthenticated={isAuthenticated}>
              <SignupForm />
            </PublicRoute>
            <PrivateRoute path="/new-map" isAuthenticated={isAuthenticated}>
              <NavbarComp />
              <MapForm />
            </PrivateRoute>
            <PrivateRoute path="/main-map" isAuthenticated={isAuthenticated}>
              <NavbarComp />
              <MainMap />
            </PrivateRoute>
            <PrivateRoute
              path="/map/:id/edit"
              isAuthenticated={isAuthenticated}
            >
              <NavbarComp />
              <MapForm />
            </PrivateRoute>
            <PrivateRoute path="/map/:id" isAuthenticated={isAuthenticated}>
              <NavbarComp />
              <SingleMap />
            </PrivateRoute>
            <PrivateRoute path="/" isAuthenticated={isAuthenticated}>
              <NavbarComp />
              <MapList />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </SidebarContext.Provider>
  );
}

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <MainRouter />
    </FirebaseAppProvider>
  );
}

export default App;
