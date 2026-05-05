import { NextResponse } from "next/server";
import { submitQuiz, getNextStage } from "@/lib/learning-engine";
import { StageType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { topicId, userId, score } = await req.json();

    if (!topicId || !userId || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attempt = await submitQuiz(userId, topicId, score);
    
    // Get next stage based on current stage (TEST) and score
    const nextStage = attempt.passed ? getNextStage(StageType.TEST, score) : StageType.TEST;

    return NextResponse.json({ 
      passed: attempt.passed, 
      score: attempt.score, 
      nextStage 
    });
  } catch (error: any) {
    console.error("[QUIZ_API_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
