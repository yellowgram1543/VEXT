import { NextResponse } from "next/server";
import { evaluatePractice, getNextStage } from "@/lib/learning-engine";
import { StageType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { topicId, type, submission, expected, userId } = await req.json();

    if (!topicId || !type || !submission || !expected) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await evaluatePractice(topicId, type, submission, expected, userId);
    
    // Get what the next stage would be if they are at PRACTICE and succeeded
    const nextStage = result.success ? getNextStage(StageType.PRACTICE) : StageType.PRACTICE;

    return NextResponse.json({ 
      success: result.success, 
      result: result.result, 
      nextStage 
    });
  } catch (error: any) {
    console.error("[PRACTICE_API_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
