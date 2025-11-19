// src/components/Levels.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Levels.css';

const Levels = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fallback Questions
  const fallbackQuestions = [
    {
      question: "Who was the first President of the United States?",
      options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
      answer: "George Washington",
    },
    {
      question: "In what year did World War II end?",
      options: ["1945", "1939", "1918", "1963"],
      answer: "1945",
    },
    {
      question: "What was the name of the ship that brought the Pilgrims to America in 1620?",
      options: ["Santa Maria", "Mayflower", "HMS Victory", "Titanic"],
      answer: "Mayflower",
    },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          "https://opentdb.com/api.php?amount=10&category=23&type=multiple"
        );
        const data = await res.json();

        if (data.response_code === 0) {
          const formatted = data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            answer: q.correct_answer,
          }));
          setQuestions(formatted);
        } else {
          throw new Error("No questions");
        }
      } catch (err) {
        console.warn("API failed, using fallback");
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  const exitToHome = () => {
    navigate('/home');
  };

  const retry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setLoading(true);
    setError("");
    setQuestions([]);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading Quiz...</p>
      </div>
    );
  }

  return (
    <div className="levels-container">
      <h1>History Quiz</h1>

      {showResult ? (
        <div className="result">
          <h2>Your Score: {score}/{questions.length}</h2>
          <div className="result-buttons">
            <button className="next-level-btn" onClick={retry}>
              Play Again
            </button>
            <button className="next-level-btn exit" onClick={exitToHome}>
              Exit
            </button>
          </div>
        </div>
      ) : (
        <div className="question">
          <h2>Question {currentQuestionIndex + 1}/{questions.length}</h2>
          <p dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, i) => (
              <button
                key={i}
                className="next-level-btn"
                onClick={() => handleAnswerClick(option)}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            ))}
          </div>
          <button className="next-level-btn exit" onClick={exitToHome}>
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default Levels;
