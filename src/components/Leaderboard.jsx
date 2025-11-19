
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("points", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc, index) => {
          const d = doc.data();
          return {
            rank: index + 1,
            username: d.username || d.nickname || "Player",  // supports old & new
            points: d.points || 0,
          };
        });

        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-card">
        <h1 className="title">Leaderboard</h1>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((player) => (
              <tr key={player.rank}>
                <td>{player.rank}</td>
                <td>{player.username}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="back-btn" onClick={() => navigate("/home")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;