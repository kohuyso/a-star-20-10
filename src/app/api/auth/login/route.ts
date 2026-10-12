import { NextResponse } from 'next/server';
import { authenticateUser, encodeSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Tên và Ngày sinh / Mật khẩu' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Tên hoặc Ngày sinh / Mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const token = encodeSession(user);

    const response = NextResponse.json({
      success: true,
      user,
      token,
    });

    // Set cookie HttpOnly
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false, // Local network
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi máy chủ trong quá trình đăng nhập' },
      { status: 500 }
    );
  }
}
