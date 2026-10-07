"use client";

import { useEffect, useState } from "react";
import { start } from "@/lib/api";
export default function Home() {
  const [stage, setStage] = useState("start"); // start | playing | done
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  async function loadLeaderboard() {
    const res = await fetch("/api/scores");
    setLeaderboard(await res.json());
  }

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function handlestart() {
    const res = await start();
    if (!name.trim()) {
      setError("Please enter your name first.");
      return;
    }
    setError("");
    setQuestions(res);
    setAnswers({});
    setIndex(0);
    setStartedAt(Date.now());
    setStage("playing");
  }

  async function choose(optionIndex) {
    const q = questions[index];
    const nextAnswers = { ...answers, [q.id]: optionIndex };
    setAnswers(nextAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }

    // Last question: send everything to the server.
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        answers: nextAnswers,
        timeMs: Date.now() - startedAt,
      }),
    });
    setResult(await res.json());
    await loadLeaderboard();
    setStage("done");
  }

  return (
    <main className="card">
      <h1>🧠 Quiz Arena</h1>

      {stage === "start" && (
        <>
          <p>Answer the web-dev questions and climb the leaderboard.</p>
          <input
            placeholder="Your name"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button onClick={handlestart}>Start game</button>
        </>
      )}

      {stage === "playing" && questions?.[index] && (
        <>
          <div>
            <div className="progress">
              Question {index + 1} / {questions.length}
            </div>
            <h2 style={{ color: "#e2e8f0", fontSize: "1.3rem", marginTop: 0 }}>
              {questions[index].text}
            </h2>
            {questions[index].options.map((opt, i) => (
              <button key={i} className="option" onClick={() => choose(i)}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {stage === "done" && result && (
        <>
          <p>
            Nice, {name}! You scored{" "}
            <strong>
              {result.score} / {result.total}
            </strong>
            .
          </p>
          <button onClick={() => setStage("start")}>Play again</button>
        </>
      )}

      <h2>🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No scores yet. Be the first!</p>
      ) : (
        <ol>
          {leaderboard.map((s, i) => (
            <li key={i}>
              {s.name} — {s.score}/{s.total} ({(s.timeMs / 1000).toFixed(1)}s)
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
