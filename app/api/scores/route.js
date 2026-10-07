import { NextResponse } from "next/server";
import { addScore, topScores } from "@/lib/db";
import { getFullQuestions } from "@/lib/questions";

// GET /api/scores -> top 10 leaderboard
export async function GET() {
  return NextResponse.json(await topScores(10));
}

// POST /api/scores  body: { name, answers: { [questionId]: optionIndex }, timeMs }
// The score is calculated on the server so players can't cheat from the browser.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "")
    .trim()
    .slice(0, 20);
  const answers = body?.answers ?? {};
  const timeMs = Number(body?.timeMs) || 0;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  let QUESTIONS;
  try {
    QUESTIONS = await getFullQuestions();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const score = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
  await addScore({
    name,
    score,
    total: QUESTIONS.length,
    timeMs,
    at: Date.now(),
  });

  return NextResponse.json({ score, total: QUESTIONS.length });
}
