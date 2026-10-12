import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let gameState = await prisma.gameState.findUnique({
      where: { id: 'default' },
    });

    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          id: 'default',
          status: 'LOBBY',
          currentSlideIndex: 0,
          activeRevealRound: 0,
          slideDurationSec: 15,
        },
      });
    }

    return NextResponse.json({ gameState });
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải trạng thái trò chơi' },
      { status: 500 }
    );
  }
}
