import { NextResponse } from 'next/server';
import { getLocalIpAddress } from '@/lib/network';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không có quyền truy cập Admin' }, { status: 403 });
    }

    const ip = getLocalIpAddress();
    const port = process.env.PORT || 3000;
    const joinUrl = `http://${ip}:${port}`;

    return NextResponse.json({
      ip,
      port,
      joinUrl,
    });
  } catch (error) {
    console.error('Error getting network info:', error);
    return NextResponse.json(
      { error: 'Lỗi khi trích xuất địa chỉ mạng LAN' },
      { status: 500 }
    );
  }
}
