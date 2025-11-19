import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import "./Play.css";

const Play = () => {
  const [countdown, setCountdown] = useState(60);
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState("");
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Sound (optional)
  const [play] = useSound("/audio.mp3", { volume: 0.5 });

  const currentUid = auth.currentUser?.uid;

  const ensureUserDoc = async () => {
    if (!currentUid) return;
    const ref = doc(db, "users", currentUid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        username: auth.currentUser?.displayName || "Player",
        email: auth.currentUser?.email,
        points: 0,
        createdAt: serverTimestamp(),
      });
    }
  };

  const addPoints = async (pts) => {
    if (!currentUid) return;
    await ensureUserDoc();
    await updateDoc(doc(db, "users", currentUid), { points: increment(pts) });
  };

  const fetchPuzzle = async () => {
    try {
      const res = await axios.get("https://marcconrad.com/uob/banana/api.php");
      setGameData(res.data);
      setIsLoading(false);
      setMessage("");
      setIsCorrect(null);
      setSelectedAnswer(null);
    } catch {
      setMessage("Failed to load puzzle");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMessage("Game Over!");
          addPoints(0);
          setTimeout(() => navigate("/home"), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (currentUid) {
      ensureUserDoc();
      fetchPuzzle();
    } else {
      navigate("/login");
    }
  }, [currentUid]);

  const handleAnswer = async (ans) => {
    if (!gameData || selectedAnswer !== null) return;
    setSelectedAnswer(ans);
    const correct = ans === gameData.solution;

    if (correct) {
      setMessage("Correct!");
      setIsCorrect(true);
      setScore((s) => s + 10);
      await addPoints(10);

      // BUBBLE + CONFETTI + SOUND
      setBubbleMsg("Amazing!");
      setShowBubble(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#27ae60", "#2ecc71", "#ffd700"],
      });
      if (!isMuted) play?.();

      setTimeout(() => {
        setShowBubble(false);
        setBubbleMsg("");
        setMessage("");
        setIsCorrect(null);
        setSelectedAnswer(null);
        fetchPuzzle();
      }, 3000); // 3 seconds
    } else {
      setMessage("Wrong!");
      setIsCorrect(false);
      setTimeout(() => {
        setMessage("");
        setIsCorrect(null);
        setSelectedAnswer(null);
        fetchPuzzle();
      }, 1500);
    }
  };

  if (isLoading) return <div className="loading">Loading puzzle...</div>;

  return (
    <div className="play-page">
      <audio ref={audioRef} src="/game-music.mp3" loop autoPlay muted={isMuted} />

              {/* Mute Button */}
      <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? "🔊 Unmute" : "🔇 Mute"}
      </button>


       {/* Timer + Score */}
      <div className="header">
        <div className="timer-score">
          ⏰ {countdown}s &nbsp; ⭐ {score}
        </div>
      </div>

      

      {/* Puzzle */}
      <div className="puzzle-container">
        <img src={gameData.question} alt="Math Puzzle" className="puzzle-img" />
      </div>

      {/* Answer Buttons */}
      <div className="answer-row">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className={`
              answer-btn
              ${selectedAnswer === n && isCorrect === true ? "correct-btn" : ""}
              ${selectedAnswer === n && isCorrect === false ? "wrong-btn" : ""}
            `}
            onClick={() => handleAnswer(n)}
            disabled={selectedAnswer !== null}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {message && (
        <div className={`feedback ${isCorrect === null ? "" : isCorrect ? "correct" : "wrong"}`}>
          {message}
        </div>
      )}

      {/* BUBBLE */}
      {showBubble && (
        <div className="bubble">
          {bubbleMsg}
        </div>
      )}
    </div>
  );
};

export default Play;
