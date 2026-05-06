import { NextRequest, NextResponse } from 'next/server';
import { unlockNextStage } from '@/lib/learning-engine';
import { StageType } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;
    const body = await request.json();
    const { currentStage, score } = body;

    if (!chapterId || !currentStage) {
      return NextResponse.json({ error: 'Missing chapterId or currentStage' }, { status: 400 });
    }

    console.log(`[Unlock API] Unlocking for ${chapterId}, current stage: ${currentStage}${score !== undefined ? `, score: ${score}` : ''}`);
    const startTime = Date.now();
    const progress = await unlockNextStage(chapterId, currentStage as StageType, score);
    console.log(`[Unlock API] Successfully unlocked in ${Date.now() - startTime}ms`);
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Unlock API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
