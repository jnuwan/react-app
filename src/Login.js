import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//import { authenticateUser } from "./api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { param } = useParams();

  if (param == "logout") {
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      //const token = await authenticateUser(username, password);
      const response = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }
      const result = await response.json();
      const token = result.token;
      localStorage.setItem("jwtToken", token); // Save token
      navigate("/home"); // Redirect to home page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-center mt-5">
            Microservice full-stack demo application - Fullstack 2024
          </h3>
        </div>
      </div>
      <div className="row justify-content-center" color="primary">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Login</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
