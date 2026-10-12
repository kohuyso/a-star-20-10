import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
    }

    const body = await req.json();
    const {
      status,
      currentQuestionNumber,
      isQuestionActive,
      timerDurationSec,
      startTimer,
      activeRevealRound,
    } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (currentQuestionNumber !== undefined) {
      updateData.currentQuestionNumber = currentQuestionNumber;
      updateData.isQuestionActive = false;
      updateData.timerStartedAt = null;
    }
    if (isQuestionActive !== undefined && currentQuestionNumber === undefined) {
      updateData.isQuestionActive = isQuestionActive;
    }
    if (timerDurationSec !== undefined) updateData.timerDurationSec = timerDurationSec;
    if (activeRevealRound !== undefined) updateData.activeRevealRound = activeRevealRound;

    if (startTimer) {
      updateData.isQuestionActive = true;
      updateData.timerStartedAt = new Date();
      updateData.status = 'VOTING';
    }

    const gameState = await prisma.gameState.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        status: status || 'LOBBY',
        currentQuestionNumber: currentQuestionNumber || 1,
        isQuestionActive: isQuestionActive || false,
        timerDurationSec: timerDurationSec || 20,
        timerStartedAt: startTimer ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, gameState });
  } catch (error: any) {
    console.error('Error updating game state:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật trạng thái game: ' + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
