import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * Chuẩn hóa chuỗi tiếng Việt sang chuẩn Unicode NFC để so sánh chính xác trên iOS và Android
 */
function normalizeVietnamese(str: string): string {
  return str.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // 1. Kiểm tra trạng thái phòng game
    const gameState = await prisma.gameState.findUnique({
      where: { id: 'default' },
    });

    if (!gameState || gameState.status !== 'VOTING' || !gameState.isQuestionActive) {
      return NextResponse.json(
        { error: 'Câu hỏi này hiện đã đóng nhận câu trả lời hoặc chưa bắt đầu!' },
        { status: 403 }
      );
    }

    // Kiểm tra hết giờ (có 4 giây buffer chống độ trễ mạng Wi-Fi)
    if (gameState.timerStartedAt && gameState.timerDurationSec) {
      const startTime = new Date(gameState.timerStartedAt).getTime();
      const now = Date.now();
      const elapsedSec = (now - startTime) / 1000;
      if (elapsedSec > gameState.timerDurationSec + 4) {
        return NextResponse.json(
          { error: '⏰ Đã hết thời gian trả lời cho câu này!' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { questionId, selectedName } = body;

    if (!questionId || !selectedName || typeof selectedName !== 'string') {
      return NextResponse.json(
        { error: 'Vui lòng chọn tên bạn nữ hợp lệ' },
        { status: 400 }
      );
    }

    const trimmedSelectedName = selectedName.normalize('NFC').trim();

    // 2. Tìm câu hỏi
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { femaleProfile: true },
    });

    if (!question) {
      return NextResponse.json({ error: 'Câu hỏi không tồn tại' }, { status: 404 });
    }

    // 3. Kiểm tra xem người dùng đã chọn tên này cho câu hỏi khác chưa
    const existingNameVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        selectedName: trimmedSelectedName,
      },
    });

    if (existingNameVote && existingNameVote.questionId !== question.id) {
      return NextResponse.json(
        { error: `Bạn đã chọn '${trimmedSelectedName}' ở một câu hỏi trước đó!` },
        { status: 400 }
      );
    }

    // 4. Kiểm tra xem người dùng đã trả lời câu này chưa
    const existingQuestionVote = await prisma.vote.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id,
        },
      },
    });

    if (existingQuestionVote) {
      return NextResponse.json(
        { error: 'Bạn đã trả lời câu hỏi này rồi, không thể sửa đổi!' },
        { status: 400 }
      );
    }

    // 5. Kiểm tra tính chính xác với chuẩn hóa Unicode NFC
    const isCorrect =
      normalizeVietnamese(question.femaleProfile.name) === normalizeVietnamese(trimmedSelectedName);

    // 6. Ghi nhận phiếu bầu với server timestamp
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        questionId: question.id,
        selectedName: trimmedSelectedName,
        isCorrect,
        answeredAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      voteId: vote.id,
      isCorrect,
    });
  } catch (error: any) {
    console.error('Error submitting vote:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bạn đã trả lời câu này hoặc đã chọn tên này rồi!' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi nộp phiếu bình chọn' },
      { status: 500 }
    );
  }
}
