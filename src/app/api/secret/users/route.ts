import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { encodeSession } from '@/lib/auth';

/**
 * GET: Lấy danh sách toàn bộ tài khoản trong hệ thống
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q')?.trim().toLowerCase() || '';
    const roleFilter = searchParams.get('role');
    const genderFilter = searchParams.get('gender');

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { votes: true, wonRounds: true },
        },
      },
    });

    const filteredUsers = users.filter((u) => {
      const matchSearch =
        !search ||
        u.username.toLowerCase().includes(search) ||
        u.fullName.toLowerCase().includes(search);
      const matchRole = !roleFilter || roleFilter === 'ALL' || u.role === roleFilter;
      const matchGender = !genderFilter || genderFilter === 'ALL' || u.gender === genderFilter;
      return matchSearch && matchRole && matchGender;
    });

    const safeUsers = filteredUsers.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      gender: u.gender,
      createdAt: u.createdAt,
      votesCount: u._count.votes,
      wonRoundsCount: u._count.wonRounds,
    }));

    return NextResponse.json({
      success: true,
      total: users.length,
      filteredCount: safeUsers.length,
      users: safeUsers,
    });
  } catch (error) {
    console.error('Error fetching secret users:', error);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi lấy danh sách tài khoản' },
      { status: 500 }
    );
  }
}

/**
 * POST: Tạo tài khoản mới trực tiếp
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, fullName, password, gender = 'MALE', role = 'PLAYER' } = body;

    const trimmedUsername = username?.toString().trim();
    const trimmedFullName = fullName?.toString().trim();
    const trimmedPassword = password?.toString().trim();

    if (!trimmedUsername) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Tên tài khoản / Mã nhân viên' },
        { status: 400 }
      );
    }

    if (!trimmedFullName) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Họ và tên' },
        { status: 400 }
      );
    }

    if (!trimmedPassword) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Mật khẩu' },
        { status: 400 }
      );
    }

    // Kiểm tra tài khoản đã tồn tại hay chưa
    const existing = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Tài khoản hoặc mã "${trimmedUsername}" đã tồn tại trên hệ thống!` },
        { status: 409 }
      );
    }

    // Mã hóa mật khẩu
    const passwordHash = await bcrypt.hash(trimmedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        username: trimmedUsername,
        fullName: trimmedFullName,
        passwordHash,
        gender: gender === 'FEMALE' ? 'FEMALE' : 'MALE',
        role: role === 'ADMIN' ? 'ADMIN' : 'PLAYER',
      },
    });

    // Tạo token đăng nhập ngay nếu client cần
    const sessionToken = encodeSession({
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role as 'PLAYER' | 'ADMIN',
      gender: newUser.gender as 'MALE' | 'FEMALE',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        gender: newUser.gender,
        createdAt: newUser.createdAt,
      },
      token: sessionToken,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo tài khoản' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Xóa tài khoản (phục vụ dọn dẹp tài khoản test)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID tài khoản cần xóa' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài khoản cần xóa' },
        { status: 404 }
      );
    }

    // Không cho phép xóa admin hệ thống mặc định
    if (user.username === 'admin') {
      return NextResponse.json(
        { error: 'Không được phép xóa tài khoản Admin mặc định của hệ thống!' },
        { status: 403 }
      );
    }

    // Xóa user (các votes liên quan sẽ cascade delete theo schema)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Đã xóa tài khoản "${user.fullName}" (${user.username})`,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Không thể xóa tài khoản này' },
      { status: 500 }
    );
  }
}
