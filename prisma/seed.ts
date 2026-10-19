import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seeding dữ liệu Astar 20/10...');

  // 1. Tạo hoặc reset GameState
  await prisma.gameState.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      status: 'LOBBY',
      currentSlideIndex: 0,
      activeRevealRound: 0,
      slideDurationSec: 15,
    },
  });

  // 2. Tạo tài khoản Admin
  const adminPassword = await bcrypt.hash('admin2010', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      fullName: 'MC / Quản Trị Viên',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  // 3. Danh sách 14 bạn Nữ Astar chính thức (Đúng theo thứ tự ảnh Google Drive)
  const femaleList = [
    { name: 'Nguyễn Thị Nhật Anh', hint: 'Thuộc team A Star X', photoUrl: '/images/female/01-nguyen-thi-nhat-anh.png' },
    { name: 'Bùi Thị Khánh Huyền', hint: 'Thuộc team Product Delivery', photoUrl: '/images/female/02-bui-thi-khanh-huyen.png' },
    { name: 'Hoàng Thùy Linh', hint: 'Thuộc team Product Delivery', photoUrl: '/images/female/03-hoang-thuy-linh.jpg' },
    { name: 'Nguyễn Nhật Linh', hint: 'Thuộc team A Star X', photoUrl: '/images/female/04-nguyen-nhat-linh.png' },
    { name: 'Mai Thu Trang', hint: 'Thuộc team Product Delivery', photoUrl: '/images/female/05-mai-thu-trang.jpg' },
    { name: 'Ngô Thị Thu Hà', hint: 'Thuộc team Back Office', photoUrl: '/images/female/06-ngo-thi-thu-ha.png' },
    { name: 'Phạm Thị Ánh Tuyết', hint: 'Thuộc team Back Office', photoUrl: '/images/female/13-pham-thi-anh-tuyet.png' },
    { name: 'Nguyễn Thị Minh Phương', hint: 'Thuộc team Product Delivery', photoUrl: '/images/female/08-nguyen-thi-minh-phuong.jpeg' },
    { name: 'Lê Hà Ngân', hint: 'Thuộc team A Star X', photoUrl: '/images/female/09-le-ha-ngan.png' },
    { name: 'Trần Bảo Yến', hint: 'Thuộc team A Star X', photoUrl: '/images/female/10-tran-bao-yen.png' },
    { name: 'Chu Yến Nhi', hint: 'Thuộc team Product Delivery', photoUrl: '/images/female/11-chu-yen-nhi.jpg' },
    { name: 'Trần Thanh Hằng', hint: 'Thuộc team Back Office', photoUrl: '/images/female/12-tran-thanh-hang.png' },
    { name: 'Lê Khánh Linh', hint: 'Thuộc team A Star X', photoUrl: '/images/female/07-le-khanh-linh.png' },
    { name: 'Đặng Quỳnh Chi', hint: 'Thuộc team Back Office', photoUrl: '/images/female/14-dang-quynh-chi.png' },
  ];

  // Xóa các câu hỏi hoặc profile mock cũ nếu có
  const validFemaleNames = femaleList.map((f) => f.name);
  await prisma.vote.deleteMany();
  await prisma.roundResult.deleteMany();
  await prisma.question.deleteMany({
    where: { questionNumber: { gt: 14 } },
  });
  await prisma.femaleProfile.deleteMany({
    where: { name: { notIn: validFemaleNames } },
  });

  for (let i = 0; i < femaleList.length; i++) {
    const item = femaleList[i];
    const order = i + 1;

    const profile = await prisma.femaleProfile.upsert({
      where: { name: item.name },
      update: {
        avatarUrl: item.photoUrl,
        hint: item.hint,
        orderIndex: order,
      },
      create: {
        name: item.name,
        avatarUrl: item.photoUrl,
        hint: item.hint,
        orderIndex: order,
      },
    });

    await prisma.question.upsert({
      where: { questionNumber: order },
      update: {
        photoUrl: item.photoUrl,
        femaleProfileId: profile.id,
      },
      create: {
        questionNumber: order,
        photoUrl: item.photoUrl,
        femaleProfileId: profile.id,
      },
    });
  }

  // 4. Danh sách 57 người chơi chính thức của công ty
  // Cột trái là mật khẩu (code), Cột phải là tài khoản (fullName)
  // Người trao quà chỉ có thể là nam (gender: MALE), nữ (gender: FEMALE) có thể đoán
  const playerList: Array<{ code: string; fullName: string; gender: 'MALE' | 'FEMALE' }> = [
    { code: 'B01', fullName: 'Nguyễn Bình Minh', gender: 'MALE' },
    { code: 'B02', fullName: 'Nguyễn Đức Thắng', gender: 'MALE' },
    { code: 'B03', fullName: 'Trần Vĩnh Đức', gender: 'MALE' },
    { code: 'B04', fullName: 'Trịnh Tuấn Đạt', gender: 'MALE' },
    { code: '00001', fullName: 'Phạm Thị Ánh Tuyết', gender: 'FEMALE' },
    { code: '00002', fullName: 'Hoàng Thanh Lâm', gender: 'MALE' },
    { code: '00003', fullName: 'Lê Đình Quyền', gender: 'MALE' },
    { code: '00004', fullName: 'Nguyễn Đức Thịnh', gender: 'MALE' },
    { code: '00005', fullName: 'Phạm Viết Bằng', gender: 'MALE' },
    { code: '00009', fullName: 'Hà Đức Tuấn', gender: 'MALE' },
    { code: '00013', fullName: 'Vũ Hoài Nam', gender: 'MALE' },
    { code: '00015', fullName: 'Nguyễn Mậu Trà', gender: 'MALE' },
    { code: '00021', fullName: 'Bùi Hồng Nhật', gender: 'MALE' },
    { code: '00022', fullName: 'Đỗ Đức Phương', gender: 'MALE' },
    { code: '00024', fullName: 'Lê Văn Hào', gender: 'MALE' },
    { code: '00027', fullName: 'Trần Quốc Việt Quang', gender: 'MALE' },
    { code: '00028', fullName: 'Đặng Mạnh Cường', gender: 'MALE' },
    { code: '00029', fullName: 'Chu Yến Nhi', gender: 'FEMALE' },
    { code: '00030', fullName: 'Phạm Minh Tuấn', gender: 'MALE' },
    { code: '00032', fullName: 'Khổng Vũ Huy', gender: 'MALE' },
    { code: '00033', fullName: 'Ngô Thị Thu Hà', gender: 'FEMALE' },
    { code: '00034', fullName: 'Trần Thanh Hằng', gender: 'FEMALE' },
    { code: '00036', fullName: 'Trần Bảo Yến', gender: 'FEMALE' },
    { code: '00038', fullName: 'Nguyễn Ích Duy', gender: 'MALE' },
    { code: '00045', fullName: 'Bùi Thị Khánh Huyền', gender: 'FEMALE' },
    { code: '00046', fullName: 'Lê Hà Ngân', gender: 'FEMALE' },
    { code: '00052', fullName: 'Trương Gia Bách', gender: 'MALE' },
    { code: '00053', fullName: 'Lê Khánh Linh', gender: 'FEMALE' },
    { code: '00056', fullName: 'Đặng Quỳnh Chi', gender: 'FEMALE' },
    { code: '00059', fullName: 'Lê Thế Chung', gender: 'MALE' },
    { code: '00062', fullName: 'Nguyễn Huy Anh', gender: 'MALE' },
    { code: 'PT0029', fullName: 'Nguyễn Thành Minh', gender: 'MALE' },
    { code: 'PT0035', fullName: 'Nguyễn Tùng Dương', gender: 'MALE' },
    { code: 'PT0039', fullName: 'Nguyễn Thị Nhật Anh', gender: 'FEMALE' },
    { code: 'INT0035', fullName: 'Nguyễn Hà Anh Tuấn', gender: 'MALE' },
    { code: 'INT0051', fullName: 'Trần Nam Khánh', gender: 'MALE' },
    { code: 'INT0052', fullName: 'Hoàng Thùy Linh', gender: 'FEMALE' },
    { code: 'INT0056', fullName: 'Nguyễn Đình Đạt', gender: 'MALE' },
    { code: 'INT0060', fullName: 'Nguyễn Đức Mạnh', gender: 'MALE' },
    { code: 'INT0061', fullName: 'Nguyễn Anh Tuấn', gender: 'MALE' },
    { code: 'INT0063', fullName: 'Nguyễn Xuân Chí Thành', gender: 'MALE' },
    { code: 'INT0066', fullName: 'Lê Đình Sáng', gender: 'MALE' },
    { code: 'INT0073', fullName: 'Nguyễn Thị Minh Phương', gender: 'FEMALE' },
    { code: 'INT0076', fullName: 'Đỗ Tuấn Minh', gender: 'MALE' },
    { code: 'INT0077', fullName: 'Nguyễn Thành Nam', gender: 'MALE' },
    { code: 'INT0080', fullName: 'Bùi Gia Nghĩa', gender: 'MALE' },
    { code: 'INT0082', fullName: 'Đỗ Trường Giang', gender: 'MALE' },
    { code: 'INT0088', fullName: 'Nguyễn Trịnh Minh Hiếu', gender: 'MALE' },
    { code: 'INT0089', fullName: 'Dương Gia Huy', gender: 'MALE' },
    { code: 'INT0090', fullName: 'Nguyễn Nhật Linh', gender: 'FEMALE' },
    { code: 'INT0091', fullName: 'Vũ Nguyên Bình', gender: 'MALE' },
    { code: 'INT0092', fullName: 'Mai Thu Trang', gender: 'FEMALE' },
    { code: 'INT0093', fullName: 'Bùi Vũ Dũng', gender: 'MALE' },
    { code: 'INT0094', fullName: 'Nguyễn Đức Hùng', gender: 'MALE' },
    { code: 'INT0095', fullName: 'Phạm Đức Gia Bảo', gender: 'MALE' },
    { code: 'INT0096', fullName: 'Trần Phương Nam', gender: 'MALE' },
    { code: 'INT0097', fullName: 'Phạm Minh Tuấn', gender: 'MALE' },
  ];

  // Xóa các user mock cũ không nằm trong danh sách và không phải admin
  const validUsernames = ['admin', ...playerList.map((p) => p.code)];
  await prisma.user.deleteMany({
    where: {
      username: {
        notIn: validUsernames,
      },
      role: 'PLAYER',
    },
  });

  for (const u of playerList) {
    const hash = await bcrypt.hash(u.code, 10);
    await prisma.user.upsert({
      where: { username: u.code },
      update: {
        fullName: u.fullName,
        passwordHash: hash,
        gender: u.gender,
      },
      create: {
        username: u.code,
        fullName: u.fullName,
        passwordHash: hash,
        role: 'PLAYER',
        gender: u.gender,
      },
    });
  }

  console.log('✅ Seed dữ liệu thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
