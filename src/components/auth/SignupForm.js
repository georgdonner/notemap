import React, { useState } from "react";
import { useAuth } from "reactfire";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const auth = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { user } = await auth.createUserWithEmailAndPassword(email, password);

    user.updateProfile({
      displayName,
    });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h1 className="my-5 text-center">Registrieren</h1>
      <form className="container" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="displayName" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="displayName"
            className="form-control"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
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
          Registrieren
        </button>
      </form>
      <Link to="/login" className="link-secondary d-block mt-3">
        Schon einen Account? Einloggen
      </Link>
    </div>
  );
};

export default SignupForm;
