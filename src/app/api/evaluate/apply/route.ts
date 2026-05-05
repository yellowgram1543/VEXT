import { NextResponse } from "next/server";
import { evaluateApply } from "@/lib/learning-engine";

export async function POST(req: Request) {
  try {
    const { topicId, submission, userId } = await req.json();

    if (!topicId || !submission) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await evaluateApply(topicId, submission, userId);
    
    return NextResponse.json({ 
      success: result.success, 
      result: result.result, 
      completed: result.success 
    });
  } catch (error: any) {
    console.error("[APPLY_API_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
