import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const token = await loginUser(email, password);

console.log("TOKEN RECEIVED:", token);

Cookies.set("jwt_token", token);

console.log("COOKIE SAVED");

navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Go Business</h1>

        <p className="login-subtitle">
          Sign in to open your referral dashboard.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="login-label">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password" className="login-label">
            Password
          </label>

          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <p className="login-error" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;