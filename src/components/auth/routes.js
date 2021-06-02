import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ isAuthenticated, children, ...rest }) => (
  <Route
    {...rest}
    render={() => (isAuthenticated ? <Redirect to="/" /> : children)}
  />
);

export const PrivateRoute = ({ isAuthenticated, children, ...rest }) => (
  <Route
    {...rest}
    render={() => (isAuthenticated ? children : <Redirect to="/login" />)}
  />
);
