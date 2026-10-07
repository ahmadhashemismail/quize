import { NextResponse } from "next/server";
import { getFullQuestions, getPublicQuestions } from "@/lib/questions";

export async function GET() {
  try {
    const fullQuestions = await getFullQuestions();
    return NextResponse.json(getPublicQuestions(fullQuestions));
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 },
    );
  }
}
