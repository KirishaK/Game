// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg({ text: "Login successful!", type: "success" });
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setMsg({ text: "Invalid email or password", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setMsg({ text: "Google Login Failed", type: "error" });
    }
  };

  const githubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setMsg({ text: "GitHub Login Failed", type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-3d-bg"></div>
      <div className="auth-card">
        <h2>LOGIN</h2>
        {msg.text && <p className={`msg ${msg.type}`}>{msg.text}</p>}

        <form onSubmit={handleEmailLogin}>
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <div className="social-login">
          <button onClick={googleLogin} className="social-btn google">
            <img src="https://www.google.com/favicon.ico" alt="G" />
            Continue with Google
          </button>
          <button onClick={githubLogin} className="social-btn github">
            <img src="https://github.com/favicon.ico" alt="GitHub" />
            Continue with GitHub
          </button>
        </div>

        <p className="footer-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login