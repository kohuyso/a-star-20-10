'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticateUser, encodeSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export interface LoginActionResult {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username?.trim() || !password?.trim()) {
    return { error: 'Vui lòng nhập đầy đủ Họ tên và Ngày sinh' };
  }

  const user = await authenticateUser(username, password);

  if (!user) {
    return { error: 'Tên hoặc Ngày sinh / Mật khẩu không chính xác' };
  }

  const token = encodeSession(user);
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  if (user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/vote');
  }
}
