/**
 * Client-side quiz API helper that deals with the server's /api/questions endpoint.
 */

export async function start() {
  try {
    const apiUrl = process.env.QUIZ_API_URL || "/api/questions";
    const res = await fetch(apiUrl);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server returned ${res.status}: ${text}`);
    }

    const questions = await res.json();

    if (!Array.isArray(questions)) {
      throw new Error("Expected an array of questions from");
    }

    return questions;
  } catch (err) {
    console.error("[quiz/api.start]", err);
    throw err;
  }
}
