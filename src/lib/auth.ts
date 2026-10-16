import { cookies, headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const SESSION_COOKIE_NAME = 'astar_session';

export interface SessionUser {
  id: string;
  username: string;
  fullName: string;
  role: 'PLAYER' | 'ADMIN';
  gender?: 'MALE' | 'FEMALE';
}

/**
 * Chuẩn hóa ngày sinh thành các dạng thông dụng để so sánh mật khẩu
 */
function getDobCandidates(input: string): string[] {
  const raw = input.trim();
  const candidates = new Set<string>([raw]);

  // Thay thế các dấu phân cách thông dụng (- . _) thành /
  const withSlash = raw.replace(/[-._]/g, '/');
  candidates.add(withSlash);

  // Bóc tách ngày / tháng
  const parts = withSlash.split('/');
  if (parts.length >= 2) {
    const day = parts[0].trim().padStart(2, '0');
    const month = parts[1].trim().padStart(2, '0');
    candidates.add(`${day}/${month}`);
    candidates.add(`${day}${month}`);
    candidates.add(`${parseInt(day, 10)}/${parseInt(month, 10)}`);
  }

  // Nếu chỉ toàn số (ví dụ: 1503 hoặc 15031998)
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly.length === 4) {
    const d = digitsOnly.slice(0, 2);
    const m = digitsOnly.slice(2, 4);
    candidates.add(`${d}/${m}`);
    candidates.add(digitsOnly);
  } else if (digitsOnly.length >= 6) {
    const d = digitsOnly.slice(0, 2);
    const m = digitsOnly.slice(2, 4);
    candidates.add(`${d}/${m}`);
    candidates.add(`${d}${m}`);
  }

  return Array.from(candidates);
}

function stripVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Đăng nhập và xác thực tài khoản
 */
export async function authenticateUser(usernameInput: string, passwordInput: string): Promise<SessionUser | null> {
  const rawInput = usernameInput.trim();
  const cleanUsername = rawInput.toLowerCase();
  const noAccentsInput = stripVietnameseAccents(rawInput);
  const usernameWithoutDot = cleanUsername.replace(/\./g, ' ');
  const usernameWithoutSpace = cleanUsername.replace(/\s+/g, '.');

  // Lấy toàn bộ users
  const users = await prisma.user.findMany();
  
  // Lọc tất cả các user tiềm năng khớp với tên / tài khoản / mã nhân viên
  const candidateUsers = users.filter((u) => {
    const uName = u.username.toLowerCase();
    const fName = u.fullName.toLowerCase();
    const fNameNoAccents = stripVietnameseAccents(u.fullName);

    return (
      uName === cleanUsername ||
      uName === usernameWithoutDot ||
      uName === usernameWithoutSpace ||
      fName === cleanUsername ||
      fNameNoAccents === noAccentsInput ||
      fName.includes(cleanUsername) ||
      fNameNoAccents.includes(noAccentsInput)
    );
  });

  if (candidateUsers.length === 0) {
    return null;
  }

  // Danh sách các biến thể mật khẩu có thể xảy ra (mã code, chữ hoa, chữ thường, ngày sinh)
  const rawPassword = passwordInput.trim();
  const passwordCandidates = Array.from(
    new Set([
      rawPassword,
      rawPassword.toUpperCase(),
      rawPassword.toLowerCase(),
      ...getDobCandidates(rawPassword),
    ])
  );

  for (const user of candidateUsers) {
    for (const candidate of passwordCandidates) {
      try {
        const isMatch = await bcrypt.compare(candidate, user.passwordHash);
        if (isMatch) {
          return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role as 'PLAYER' | 'ADMIN',
            gender: (user.gender as 'MALE' | 'FEMALE') || 'MALE',
          };
        }
      } catch {
        // bỏ qua lỗi compare nếu candidate không hợp lệ
      }
    }
  }

  return null;
}

/**
 * Mã hoá payload session thành chuỗi base64url
 */
export function encodeSession(user: SessionUser): string {
  const payload = JSON.stringify({
    ...user,
    issuedAt: Date.now(),
  });
  return Buffer.from(payload).toString('base64url');
}

/**
 * Giải mã chuỗi session cookie / token
 */
export function decodeSession(token: string): SessionUser | null {
  try {
    const json = Buffer.from(token, 'base64url').toString('utf-8');
    const data = JSON.parse(json);
    if (!data.id || !data.username) {
      return null;
    }
    return {
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      gender: data.gender || 'MALE',
    };
  } catch {
    return null;
  }
}

/**
 * Lấy thông tin user hiện tại từ Next.js cookies hoặc Authorization/x-astar-token headers
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    // 1. Kiểm tra Cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const user = decodeSession(sessionCookie.value);
      if (user) return user;
    }

    // 2. Kiểm tra Header token dự phòng cho mạng LAN Mobile
    const headerList = await headers();
    const authHeader = headerList.get('authorization') || headerList.get('x-astar-token');
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (token) {
        return decodeSession(token);
      }
    }
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'digest' in err &&
      typeof (err as { digest: unknown }).digest === 'string'
    ) {
      throw err;
    }
    console.error('Error getting current user:', err);
  }

  return null;
}

