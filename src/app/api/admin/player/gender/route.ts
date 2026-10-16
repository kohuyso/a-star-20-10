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
    const { userId, gender } = body;

    if (!userId || !gender || !['MALE', 'FEMALE'].includes(gender)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { gender },
      select: {
        id: true,
        username: true,
        fullName: true,
        gender: true,
      },
    });

    return NextResponse.json({ success: true, player: updated });
  } catch (error) {
    console.error('Error updating player gender:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật giới tính người chơi' },
      { status: 500 }
    );
  }
}
