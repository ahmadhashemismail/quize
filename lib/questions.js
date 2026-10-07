/**
 * Server-side question fetching with caching.
 *
 * Questions are fetched from the URL configured via QUIZ_API_URL
 * (and optionally authenticated with QUIZ_API_KEY).  Results are
 * cached for a short TTL so that the correct answers used for scoring
 * stay consistent with the questions the player actually answered.
 */

let cachedQuestions = null;
let fetchedAt = 0;
const CACHE_TTL = 60_000; // 1 minute

/**
 * Fetch questions from the external API and normalise them into a
 * common shape regardless of which QuizAPI format is returned.
 */
async function fetchFromApi() {
  const apiUrl = process.env.QUIZ_API_URL;
  const apiKey = process.env.QUIZ_API_KEY;

  if (!apiUrl) {
    throw new Error("QUIZ_API_URL is not set in environment variables");
  }

  const res = await fetch(apiUrl, {
    headers: apiKey ? { "X-Api-Key": apiKey } : {},
  });

  if (!res.ok) {
    throw new Error(`Quiz API error: ${res.status}`);
  }

  const raw = await res.json();
  // The API may return a wrapped response ({ success, data }) or a
  // bare array – handle both.
  const list = Array.isArray(raw.results) ? raw.results : Array.isArray(raw.data) ? raw.data : Array.isArray(raw) ? raw : [];

  return list.map(transformQuestion);
}

/**
 * Convert one raw API question into the shape the app expects:
 *   { id, text, options, answer }
 * where `answer` is the **index** of the correct option inside `options`.
 */
function transformQuestion(raw) {
  const id = String(raw.id ?? Math.random().toString(36).slice(2));
  const text = raw.text ?? raw.question ?? "";

  let options = [];
  let answerIndex = 0;

  // ── OpenTDB format: correct_answer & incorrect_answers array ─────
  if (raw.correct_answer && Array.isArray(raw.incorrect_answers)) {
    options = [...raw.incorrect_answers];
    // Insert correct answer at a random position
    const insertIndex = Math.floor(Math.random() * (options.length + 1));
    options.splice(insertIndex, 0, raw.correct_answer);
    answerIndex = insertIndex;
  }
  // ── New QuizAPI format: answers array with { text, isCorrect } ─────
  else if (Array.isArray(raw.answers)) {
    options = raw.answers.map((a) => a.text);
    answerIndex = raw.answers.findIndex((a) => a.isCorrect);
    if (answerIndex < 0) answerIndex = 0;
  }
  // ── Old QuizAPI format: answers object { A: "text", B: "text" } ─────
  else if (raw.answers && typeof raw.answers === "object" && !Array.isArray(raw.answers)) {
    const letters = Object.keys(raw.answers);
    options = letters.map((l) => raw.answers[l]);
    const correctLetter = raw.correctAnswer ?? raw.answer ?? letters[0];
    answerIndex = letters.indexOf(correctLetter);
    if (answerIndex < 0) answerIndex = 0;
  }
  // ── options array + answer (letter or index) ──────────────────────
  else if (Array.isArray(raw.options)) {
    options = [...raw.options];
    if (typeof raw.answer === "number") {
      answerIndex = raw.answer;
    } else {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      answerIndex = letters.indexOf(raw.answer ?? "A");
      if (answerIndex < 0) answerIndex = 0;
    }
  }
  // ── options object { A: "text", ... } ─────────────────────────────
  else if (raw.options && typeof raw.options === "object") {
    const letters = Object.keys(raw.options);
    options = letters.map((l) => raw.options[l]);
    if (typeof raw.answer === "number") {
      answerIndex = raw.answer;
    } else {
      answerIndex = letters.indexOf(raw.answer ?? letters[0]);
      if (answerIndex < 0) answerIndex = 0;
    }
  }

  return { id, text, options, answer: answerIndex };
}

/**
 * Get the full question set (including correct answers) for scoring.
 * Results are cached on the server.
 */
export async function getFullQuestions() {
  const now = Date.now();
  if (cachedQuestions && now - fetchedAt < CACHE_TTL) {
    return cachedQuestions;
  }
  cachedQuestions = await fetchFromApi();
  fetchedAt = now;
  return cachedQuestions;
}

/**
 * Strip the correct answers so they are never sent to the browser.
 */
export function getPublicQuestions(questions) {
  return questions.map(({ id, text, options }) => ({ id, text, options }));
}