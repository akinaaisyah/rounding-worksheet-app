/* =========================================
   IMPORT SECTION
========================================= */

import { useState, useEffect } from "react";
import { questions } from "./data/questions";
import { supabase } from "./supabaseClient";
import "./App.css";

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
    { name: "Cat Learner", emoji: "🐱" },
    { name: "Rocket Student", emoji: "🚀" },
    { name: "Math Hero", emoji: "🦸" },
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
    /* ---------- NAME VALIDATION ---------- */

    if (!name.trim()) {
      alert("Please enter your name first!");
      return;
    }

    /* ---------- PROFILE VALIDATION ---------- */

    if (!profile) {
      alert("Please choose your profile first!");
      return;
    }

    /* ---------- SCORE CALCULATION ---------- */

    let total = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        total++;
      }
    });

    setScore(total);

    /* ---------- PERCENTAGE CALCULATION ---------- */

    const percentage = (total / questions.length) * 100;
    const percentageRounded = Math.round(percentage);

    /* ---------- MOTIVATIONAL MESSAGE ---------- */

    if (percentage === 100) {
      setMessage("Perfect score! You're a rounding master!");
    } else if (percentage >= 80) {
      setMessage("Amazing work! You're doing really well!");
    } else if (percentage >= 50) {
      setMessage("Good try! Keep practicing and you'll improve!");
    } else {
      setMessage("Don't give up! Every mistake helps you learn!");
    }

    /* ---------- SHOW POPUP ---------- */

    setShowPopup(true);

    /* ---------- SAVE DATA INTO DATABASE ---------- */

    const { error } = await supabase.from("worksheet_results").insert([
      {
        name: name.trim(),
        profile: profile,
        score: total,
        total: questions.length,
        percentage: percentageRounded,
      },
    ]);

    if (error) {
      console.log(error);
    } else {
      console.log("Score saved successfully!");
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
         MAIN WORKSHEET CONTAINER
      ========================================= */}

      <main className="worksheet-container">
        {/* =========================================
           TITLE SECTION
        ========================================= */}

        <h1 className="title">Rounding Off Worksheet</h1>

        <p className="subtitle">Round the numbers to the nearest 10.</p>

        {/* =========================================
           NAME INPUT
        ========================================= */}

        <input
          type="text"
          placeholder="Enter your name"
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* =========================================
           PROFILE SELECTION
        ========================================= */}

        <div className="profile-section">
          <h3>Choose your profile</h3>

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
                <div className="profile-emoji">{item.emoji}</div>

                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
           QUESTIONS SECTION
        ========================================= */}

        <div className="questions-grid">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <h2 className="question-title">
                {q.id}. {q.question}
              </h2>

              {/* =========================================
                 OPTIONS SECTION
              ========================================= */}

              <div className="options-grid">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(q.id, option)}
                    className={
                      answers[q.id] === option
                        ? "option-btn selected"
                        : "option-btn"
                    }
                  >
                    {option}
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
          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>

          <button onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </div>

        {/* =========================================
           POPUP RESULT SECTION
        ========================================= */}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h2>Your Results</h2>

              <p className="popup-score">
                {score}/{questions.length}
              </p>

              <p className="popup-message">{message}</p>

              <button
                className="close-popup-btn"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* =========================================
           SCORE DISPLAY SECTION
        ========================================= */}

        {score !== null && (
          <div className="score-box">
            <h2>
              {selectedProfile?.emoji} {name} the {profile}
            </h2>

            <h3>
              Score: {score}/{questions.length}
            </h3>
          </div>
        )}
      </main>

      {/* =========================================
         LEADERBOARD SECTION
      ========================================= */}

      <section className="leaderboard-section">
        <h2 className="leaderboard-title">Leaderboard</h2>

        <div className="leaderboard-list">
          {leaderboard.length === 0 ? (
            <p className="empty-leaderboard">
              No scores yet. Be the first to submit!
            </p>
          ) : (
            leaderboard.map((player, index) => (
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
                  <div className="rank-badge">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </div>

                  <div>
                    {player.profile === "Cat Learner" && "🐱"}
                    {player.profile === "Rocket Student" && "🚀"}
                    {player.profile === "Math Hero" && "🦸"}{" "}
                    {player.name}
                  </div>
                </div>

                <div className="leaderboard-score">
                  {player.score}/{player.total}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* =========================================
         FOOTER SECTION
      ========================================= */}

      <footer className="footer">copyright: www.mathinenglish.com</footer>
    </div>
  );
}

/* =========================================
   EXPORT APP
========================================= */

export default App;