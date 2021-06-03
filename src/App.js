import { FirebaseAppProvider } from "reactfire";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useUser } from "reactfire";

import { PrivateRoute, PublicRoute } from "./components/auth/routes";

import Map from "./components/Map";
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
  const user = useUser();
  const isAuthenticated = Boolean(user?.data);

  return user?.status === "loading" || !user?.hasEmitted ? (
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
          <PrivateRoute path="/" isAuthenticated={isAuthenticated}>
            <Map />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
