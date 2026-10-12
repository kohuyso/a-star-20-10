import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const players = await prisma.user.findMany({
      where: { role: 'PLAYER' },
      select: {
        id: true,
        username: true,
        fullName: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching public players:', error);
    return NextResponse.json({ players: [] });
  }
}
