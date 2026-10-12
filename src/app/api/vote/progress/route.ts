import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function normalizeVietnamese(str: string): string {
  return str.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // 1. Lấy trạng thái GameState
    let gameState = await prisma.gameState.findUnique({
      where: { id: 'default' },
    });

    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          id: 'default',
          status: 'LOBBY',
          currentQuestionNumber: 1,
          isQuestionActive: false,
          timerDurationSec: 20,
        },
      });
    }

    // 2. Lấy toàn bộ 14 bạn nữ
    const allFemales = await prisma.femaleProfile.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    const allFemaleNames = allFemales.map((f: any) => f.name.normalize('NFC').trim());

    // 3. Lấy toàn bộ câu hỏi
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { questionNumber: 'asc' },
      include: {
        femaleProfile: {
          select: {
            id: true,
            hint: true,
          },
        },
      },
    });

    // 4. Lấy câu hỏi hiện tại mà Admin đang chiếu
    const activeQNumber = gameState.currentQuestionNumber || 1;
    const currentQuestion = questions.find((q: any) => q.questionNumber === activeQNumber) || questions[0];

    // 5. Lấy danh sách phiếu bầu của user này
    const userVotes = await prisma.vote.findMany({
      where: { userId: user.id },
      include: {
        question: {
          select: { questionNumber: true },
        },
      },
    });

    // Kiểm tra user đã trả lời câu hỏi hiện tại chưa
    const voteForCurrentQ = userVotes.find((v: any) => v.questionId === currentQuestion?.id);

    // Tên đã chọn ở các câu hỏi khác
    const otherVotes = userVotes.filter((v: any) => v.questionId !== currentQuestion?.id);
    const previouslySelectedNamesNorm = otherVotes.map((v: any) => normalizeVietnamese(v.selectedName));
    const selectedNames = userVotes.map((v: any) => v.selectedName);

    // Danh sách tên còn lại mà user ĐƯỢC PHÉP chọn cho câu này
    const remainingFemaleNames = allFemaleNames.filter(
      (name: string) => !previouslySelectedNamesNorm.includes(normalizeVietnamese(name))
    );

    return NextResponse.json({
      gameState: gameState.status,
      currentQuestionNumber: activeQNumber,
      isQuestionActive: gameState.isQuestionActive,
      timerDurationSec: gameState.timerDurationSec,
      timerStartedAt: gameState.timerStartedAt,
      totalQuestions: questions.length,
      currentQuestion: currentQuestion
        ? {
            id: currentQuestion.id,
            questionNumber: currentQuestion.questionNumber,
            photoUrl: currentQuestion.photoUrl,
            hint: currentQuestion.femaleProfile.hint,
          }
        : null,
      userAnswerForCurrentQuestion: voteForCurrentQ
        ? {
            selectedName: voteForCurrentQ.selectedName,
            answeredAt: voteForCurrentQ.answeredAt,
          }
        : null,
      selectedNames,
      remainingFemaleNames,
      answersCount: userVotes.length,
    });
  } catch (error) {
    console.error('Error in vote progress:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải tiến trình bình chọn' },
      { status: 500 }
    );
  }
}
