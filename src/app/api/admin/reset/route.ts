import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
    }

    // Xóa toàn bộ votes và roundResults
    await prisma.$transaction([
      prisma.vote.deleteMany({}),
      prisma.roundResult.deleteMany({}),
      prisma.gameState.upsert({
        where: { id: 'default' },
        update: {
          status: 'LOBBY',
          currentQuestionNumber: 1,
          isQuestionActive: false,
          timerStartedAt: null,
          currentSlideIndex: 0,
          activeRevealRound: 0,
        },
        create: {
          id: 'default',
          status: 'LOBBY',
          currentQuestionNumber: 1,
          isQuestionActive: false,
          timerStartedAt: null,
          currentSlideIndex: 0,
          activeRevealRound: 0,
          slideDurationSec: 15,
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Đã reset toàn bộ dữ liệu vòng chơi' });
  } catch (error) {
    console.error('Error resetting game:', error);
    return NextResponse.json(
      { error: 'Lỗi khi đặt lại dữ liệu trò chơi' },
      { status: 500 }
    );
  }
}
