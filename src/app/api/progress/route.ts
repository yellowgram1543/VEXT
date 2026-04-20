import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { moduleId, chapterId, completed } = await req.json();

  if (!moduleId || !chapterId) {
    return new NextResponse("Missing data", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_chapterId: {
        userId: user.id,
        chapterId: chapterId,
      },
    },
    update: {
      completed: completed,
    },
    create: {
      userId: user.id,
      moduleId: moduleId,
      chapterId: chapterId,
      completed: completed,
    },
  });

  return NextResponse.json(progress);
}
