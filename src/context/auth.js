import { createContext } from "react";

const AuthContext = createContext({
  signedIn: false,
  user: null,
  loading: true,
});

export default AuthContext;
