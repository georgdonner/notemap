import { FirebaseAppProvider } from "reactfire";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSigninCheck } from "reactfire";

import { PrivateRoute, PublicRoute } from "./components/auth/routes";

import MapList from "./components/maps-list/MapList";
import MapForm from "./components/maps-list/MapForm";
import Map from "./components/map/Map";
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
            <Map mapID="xWW0J3cU3KpdP3vEarom" />
          </PrivateRoute>
          <PrivateRoute path="/map/:id" isAuthenticated={isAuthenticated}>
            <Map />
          </PrivateRoute>
          <PrivateRoute path="/map/:id/edit" isAuthenticated={isAuthenticated}>
            <MapForm />
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
