import React, { useState } from "react";
import { useAuth } from "reactfire";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password);
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h1 className="my-5 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Adresse
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Passwort
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Anmelden
        </button>
      </form>
      <Link to="/signup" className="link-secondary d-block mt-3">
        Noch kein Account? Registrieren
      </Link>
    </div>
  );
};

export default LoginForm;
