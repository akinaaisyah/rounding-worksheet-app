/* =========================================
   IMPORT SECTION
========================================= */

import { useState, useEffect } from "react";
import { questions } from "./data/questions";
import { supabase } from "./supabaseClient";
import confetti from "canvas-confetti";
import "./App.css";

/* =========================================
   IMAGE IMPORT SECTION
   Make sure these files exist in: src/assets/
========================================= */

import backgroundImage from "./assets/Background image.png";
import mathieImage from "./assets/Mathie.png";
import mingoImage from "./assets/Mingo.png";
import puffinImage from "./assets/Puffin Profile.png";

/* =========================================
   MAIN APP COMPONENT
========================================= */

function App() {
  /* =========================================
     STATE MANAGEMENT
  ========================================= */

  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [profile, setProfile] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  /* =========================================
     PROFILE DATA
  ========================================= */

  const profiles = [
    {
      name: "Mathie",
      role: "Cat Learner",
      image: mathieImage,
    },
    {
      name: "Mingo",
      role: "Rocket Student",
      image: mingoImage,
    },
    {
      name: "Puffin",
      role: "Math Hero",
      image: puffinImage,
    },
  ];

  /* =========================================
     HANDLE OPTION SELECTION
  ========================================= */

  const handleSelect = (id, option) => {
    setAnswers({
      ...answers,
      [id]: option,
    });
  };

  /* =========================================
     LEADERBOARD FUNCTION
  ========================================= */

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("worksheet_results")
      .select("*")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) {
      console.log(error);
      return;
    }

    setLeaderboard(data || []);
  };

  /* =========================================
     LOAD LEADERBOARD AUTOMATICALLY
  ========================================= */

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  /* =========================================
     HANDLE FORM SUBMISSION
  ========================================= */

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name first!");
      return;
    }

    if (!profile) {
      alert("Please choose your avatar first!");
      return;
    }

    let total = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        total++;
      }
    });

    setScore(total);

    const percentage = (total / questions.length) * 100;
    const percentageRounded = Math.round(percentage);

    if (percentage === 100) {
      setMessage("Perfect score! You are a rounding superstar! 🌟");
    } else if (percentage >= 80) {
      setMessage("Amazing work! You are climbing the leaderboard! 🏆");
    } else if (percentage >= 50) {
      setMessage("Good try! Practice makes progress! 💪");
    } else {
      setMessage("Do not give up! Every mistake helps you learn! 💙");
    }

    setShowPopup(true);

    if (percentage >= 80) {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }

    const selectedProfile = profiles.find((p) => p.name === profile);

    const { error } = await supabase.from("worksheet_results").insert([
      {
        name: name.trim(),
        profile: selectedProfile.role,
        score: total,
        total: questions.length,
        percentage: percentageRounded,
      },
    ]);

    if (error) {
      console.log(error);
    } else {
      fetchLeaderboard();
    }
  };

  /* =========================================
     HANDLE RESET
  ========================================= */

  const handleReset = () => {
    setName("");
    setProfile("");
    setAnswers({});
    setScore(null);
    setMessage("");
    setShowPopup(false);
  };

  /* =========================================
     GET SELECTED PROFILE OBJECT
  ========================================= */

  const selectedProfile = profiles.find((p) => p.name === profile);

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="app">
      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="hero-top-bar">
          <div className="top-pill">🐾 Round Up!</div>
          <div className="coin-box">👑 1250</div>
        </div>

        <img
          src={mathieImage}
          alt="Mathie mascot"
          className="hero-mascot hero-mascot-left"
        />

        <img
          src={mingoImage}
          alt="Mingo mascot"
          className="hero-mascot hero-mascot-right"
        />

        <div className="hero-content">
          <h1 className="hero-title">ROUND UP!</h1>

          <div className="hero-ribbon">
            Rounding Off Challenge
          </div>

          <p className="hero-desc">
            Round the numbers to the nearest 10 <br />
            and become a <b>math star!</b> ⭐
          </p>

          <button className="hero-cta-btn">
            Let's Start! →
          </button>
        </div>
      </section>

      {/* =========================================
          MAIN GRID
      ========================================= */}

      <main className="main-grid">
        {/* =========================================
            WORKSHEET SECTION
        ========================================= */}

        <section className="worksheet-container">
          <div className="start-banner">
            🐾 Let's get started!
          </div>

          {/* =========================================
              NAME INPUT SECTION
          ========================================= */}

          <label className="input-label">
            Enter your name
          </label>

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type your name here..."
              className="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <span className="input-paw">🐾</span>
          </div>

          {/* =========================================
              PROFILE SELECTION SECTION
          ========================================= */}

          <div className="profile-section">
            <h3>Choose your avatar</h3>

            <div className="profile-grid">
              {profiles.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setProfile(item.name)}
                  className={
                    profile === item.name
                      ? "profile-card selected-profile"
                      : "profile-card"
                  }
                >
                  <div className="profile-avatar-img">
                    <img src={item.image} alt={item.name} />

                    {profile === item.name && (
                      <span className="profile-check">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="profile-role">
                    {item.role}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* =========================================
              PROGRESS BAR SECTION
          ========================================= */}

          <div className="progress-bar-section">
            <div className="progress-header">
              <span>
                Answered {Object.keys(answers).length} of{" "}
                {questions.length}
              </span>

              <span className="timer-badge">⏱ Practice Mode</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    (Object.keys(answers).length /
                      questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* =========================================
              QUESTIONS SECTION
          ========================================= */}

          <div className="questions-grid">
            {questions.map((q, questionIndex) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <span className="question-number">
                    {q.id}
                  </span>

                  <span className="question-count">
                    Question {questionIndex + 1} of{" "}
                    {questions.length}
                  </span>
                </div>

                <h2 className="question-title">
                  {q.question}
                </h2>

                <div className="options-grid">
                  {q.options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() =>
                        handleSelect(q.id, option)
                      }
                      className={
                        answers[q.id] === option
                          ? "option-btn selected"
                          : "option-btn"
                      }
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* =========================================
              BUTTON SECTION
          ========================================= */}

          <div className="button-row">
            <button
              onClick={handleReset}
              className="reset-btn"
            >
              ↻ Play Again
            </button>

            <button
              onClick={handleSubmit}
              className="submit-btn"
            >
              Submit Quiz →
            </button>
          </div>

          {/* =========================================
              SCORE DISPLAY SECTION
          ========================================= */}

          {score !== null && (
            <div className="score-box">
              <div className="score-mascot">
                <img
                  src={selectedProfile?.image}
                  alt={selectedProfile?.name}
                />
              </div>

              <div className="score-content">
                <h2>Great Job, {name}!</h2>

                <div className="big-score">
                  {score}
                  <span>/{questions.length}</span>
                </div>

                <p className="score-tagline">
                  You're a Rounding Star!
                </p>

                <p className="score-message">
                  {message}
                </p>
              </div>

              <div className="score-trophy">🏆</div>
            </div>
          )}
        </section>

        {/* =========================================
            SIDE PANEL
        ========================================= */}

        <aside className="side-panel">
          {/* =========================================
              PROFILE PREVIEW
          ========================================= */}

          <section className="profile-preview">
            <h2>Your Profile</h2>

            <div className="profile-preview-avatar">
              {selectedProfile ? (
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                />
              ) : (
                <div className="profile-placeholder">
                  🐱
                </div>
              )}
            </div>

            <h3>
              {selectedProfile?.name || "Choose Avatar"}
            </h3>

            <p>
              {selectedProfile?.role ||
                "Start your math adventure!"}
            </p>
          </section>

          {/* =========================================
              LEADERBOARD SECTION
          ========================================= */}

          <section className="leaderboard-section">
            <h2 className="leaderboard-title">
              🏆 Leaderboard
            </h2>

            <div className="leaderboard-list">
              {leaderboard.length === 0 ? (
                <p className="empty-leaderboard">
                  No scores yet. Be the first to submit!
                </p>
              ) : (
                leaderboard.map((player, index) => {
                  const playerProfile = profiles.find(
                    (p) => p.role === player.profile
                  );

                  return (
                    <div
                      key={player.id}
                      className={
                        index === 0
                          ? "leaderboard-card gold"
                          : index === 1
                          ? "leaderboard-card silver"
                          : index === 2
                          ? "leaderboard-card bronze"
                          : "leaderboard-card"
                      }
                    >
                      <div className="leaderboard-player">
                        <span className="rank-badge">
                          {index === 0 && "🥇"}
                          {index === 1 && "🥈"}
                          {index === 2 && "🥉"}
                          {index > 2 && index + 1}
                        </span>

                        <div className="leaderboard-avatar">
                          {playerProfile ? (
                            <img
                              src={playerProfile.image}
                              alt={playerProfile.name}
                            />
                          ) : (
                            "🐱"
                          )}
                        </div>

                        <div className="leaderboard-info">
                          <strong>{player.name}</strong>
                          <small>{player.profile}</small>
                        </div>
                      </div>

                      <div className="leaderboard-score-col">
                        <strong>
                          {player.score}/{player.total}
                        </strong>

                        {index === 0 && <span>👑</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </main>

      {/* =========================================
          POPUP RESULT SECTION
      ========================================= */}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-mascot">
              <img
                src={selectedProfile?.image}
                alt={selectedProfile?.name}
              />
            </div>

            <h2>🎉 Amazing Work! 🎉</h2>

            <p className="popup-name">
              {name} the {selectedProfile?.name}
            </p>

            <p className="popup-score">
              {score}/{questions.length}
            </p>

            <p className="popup-message">
              {message}
            </p>

            <div className="popup-buttons">
              <button
                className="popup-reset-btn"
                onClick={handleReset}
              >
                Play Again
              </button>

              <button
                className="close-popup-btn"
                onClick={() => setShowPopup(false)}
              >
                Back to Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          FOOTER SECTION
      ========================================= */}

      <footer className="footer">
        copyright: www.mathinenglish.com
      </footer>
    </div>
  );
}

export default App;