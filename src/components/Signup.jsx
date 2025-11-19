
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        username,
        email,
        points: 0,
        createdAt: serverTimestamp(),
      });
      setMsg({ text: "Signed up! Go to login", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg({ text: err.code === "auth/email-already-in-use" ? "Email already used" : "Signup failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        username: result.user.displayName || "Player",
        email: result.user.email,
        points: 0,
        createdAt: serverTimestamp(),
      }, { merge: true });
      navigate("/home");
    } catch (err) {
      setMsg({ text: "Google Signup Failed", type: "error" });
    }
  };

  const githubSignup = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        username: result.user.displayName || "GitHub User",
        email: result.user.email || "",
        points: 0,
        createdAt: serverTimestamp(),
      }, { merge: true });
      navigate("/home");
    } catch (err) {
      setMsg({ text: "GitHub Signup Failed", type: "error" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-3d-bg"></div>
      <div className="auth-card">
        <h2>SIGN UP</h2>
        {msg.text && <p className={`msg ${msg.type}`}>{msg.text}</p>}

        <form onSubmit={handleEmailSignup}>
          <div className="input-group">
            <User className="input-icon" />
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <div className="input-group">
            <Mail className="input-icon" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Creating..." : "SIGN UP"}
          </button>
        </form>

        <div className="social-login">
          <button onClick={googleSignup} className="social-btn google">
            <img src="https://www.google.com/favicon.ico" alt="G" />
            Continue with Google
          </button>
          <button onClick={githubSignup} className="social-btn github">
            <img src="https://github.com/favicon.ico" alt="GitHub" />
            Continue with GitHub
          </button>
        </div>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;