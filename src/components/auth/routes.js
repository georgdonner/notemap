import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../context/auth";
import Navbar from "../common/NavbarComp";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { signedIn } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() => (signedIn ? <Redirect to="/" /> : <Component />)}
    />
  );
};

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { signedIn } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() =>
        signedIn ? (
          <>
            <Navbar />
            {<Component />}
          </>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
