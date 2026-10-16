import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
    }

    const totalQuestions = await prisma.question.count({ where: { isActive: true } });

    // Lấy toàn bộ người chơi (Role = PLAYER)
    const players = await prisma.user.findMany({
      where: { role: 'PLAYER' },
      orderBy: { fullName: 'asc' },
      include: {
        votes: {
          orderBy: { answeredAt: 'asc' },
          select: {
            id: true,
            questionId: true,
            selectedName: true,
            isCorrect: true,
            answeredAt: true,
          },
        },
      },
    });

    const playerStats = players.map((player: any) => {
      const answersCount = player.votes.length;
      const correctCount = player.votes.filter((v: any) => v.isCorrect).length;
      const completed = answersCount >= totalQuestions && totalQuestions > 0;
      const lastAnswer = player.votes.length > 0 ? player.votes[player.votes.length - 1] : null;

      let status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' = 'NOT_STARTED';
      if (completed) {
        status = 'COMPLETED';
      } else if (answersCount > 0) {
        status = 'IN_PROGRESS';
      }

      return {
        id: player.id,
        username: player.username,
        fullName: player.fullName,
        gender: player.gender,
        answersCount,
        totalQuestions,
        correctCount,
        completed,
        status,
        lastAnsweredAt: lastAnswer ? lastAnswer.answeredAt : null,
      };
    });

    const totalPlayers = players.length;
    const completedCount = playerStats.filter((p: any) => p.status === 'COMPLETED').length;
    const inProgressCount = playerStats.filter((p: any) => p.status === 'IN_PROGRESS').length;
    const notStartedCount = playerStats.filter((p: any) => p.status === 'NOT_STARTED').length;

    return NextResponse.json({
      summary: {
        totalPlayers,
        completedCount,
        inProgressCount,
        notStartedCount,
        totalQuestions,
      },
      players: playerStats,
    });
  } catch (error) {
    console.error('Error fetching admin roster:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải danh sách người chơi' },
      { status: 500 }
    );
  }
}
