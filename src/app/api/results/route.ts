import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRevealRounds } from '@/lib/game-engine';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = (searchParams.get('sortBy') as 'QUESTION_NUMBER' | 'DIFFICULTY') || 'QUESTION_NUMBER';

    // 1. Lấy dữ liệu 14 bạn nữ
    const femaleProfiles = await prisma.femaleProfile.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    // 2. Lấy câu hỏi
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
    });

    // 3. Lấy người chơi nam
    const users = await prisma.user.findMany({
      where: { role: 'PLAYER' },
    });

    // 4. Lấy tất cả votes
    const votes = await prisma.vote.findMany({
      orderBy: { answeredAt: 'asc' },
    });

    // 5. Tính toán theo thuật toán D4
    const rounds = calculateRevealRounds({
      femaleProfiles,
      questions,
      votes,
      users,
      sortBy,
    });

    // 6. Lấy trạng thái game hiện tại
    const gameState = await prisma.gameState.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json({
      gameState: gameState?.status || 'LOBBY',
      activeRevealRound: gameState?.activeRevealRound || 0,
      totalRounds: rounds.length,
      rounds,
    });
  } catch (error) {
    console.error('Error calculating results:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tính toán kết quả công bố' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
    }

    const body = await req.json();
    const { activeRevealRound, manualAssign } = body;

    if (manualAssign) {
      const { femaleProfileId, assignedUserId, selectionReason } = manualAssign;
      await prisma.roundResult.upsert({
        where: { femaleProfileId },
        update: {
          assignedUserId,
          selectionReason: selectionReason || 'MANUAL',
        },
        create: {
          femaleProfileId,
          assignedUserId,
          selectionReason: selectionReason || 'MANUAL',
        },
      });
    }

    if (activeRevealRound !== undefined) {
      await prisma.gameState.upsert({
        where: { id: 'default' },
        update: { activeRevealRound },
        create: {
          id: 'default',
          activeRevealRound,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating reveal round:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật vòng công bố' },
      { status: 500 }
    );
  }
}
