import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StageType } from '@prisma/client';

/**
 * GET /api/progress/[chapterId]
 * Returns the completion status for a given chapter ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    const progress = await prisma.progress.findUnique({
      where: { chapterId },
    });

    // We consider it "completed" if it exists and highestStage is APPLY
    return NextResponse.json({ completed: progress?.highestStage === StageType.APPLY });
  } catch (error) {
    console.error('[PROGRESS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/progress/[chapterId]
 * Toggles the completion status for a given chapter ID.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    const existingProgress = await prisma.progress.findUnique({
      where: { chapterId },
    });

    if (existingProgress && existingProgress.highestStage === StageType.APPLY) {
      // Unmark complete (reset to UNDERSTAND or delete? Let's delete for toggle behavior)
      await prisma.progress.delete({
        where: { chapterId },
      });
      return NextResponse.json({ completed: false });
    } else {
      // Mark complete (upsert to APPLY)
      await prisma.progress.upsert({
        where: { chapterId },
        create: { 
          chapterId,
          highestStage: StageType.APPLY,
          completedAt: new Date()
        },
        update: {
          highestStage: StageType.APPLY,
          completedAt: new Date()
        }
      });
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    console.error('[PROGRESS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
