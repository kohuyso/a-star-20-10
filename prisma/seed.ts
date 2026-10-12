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

  // 3. Danh sách 14 bạn Nữ Astar (Mock data - có thể thay thế bằng file thật)
  const femaleList = [
    { name: 'Nguyễn Thị Mai Lan', hint: 'Cô gái yêu mèo và mê trà sữa', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' },
    { name: 'Trần Thu Trang', hint: 'Thích leo núi và chụp ảnh film', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800' },
    { name: 'Lê Hoàng Yến', hint: 'Chuyên gia làm bánh ngọt siêu đỉnh', photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800' },
    { name: 'Phạm Ngọc Ánh', hint: 'Fan cứng của K-pop và du lịch bụi', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800' },
    { name: 'Hoàng Bảo Châu', hint: 'Nụ cười toả nắng phòng kinh doanh', photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800' },
    { name: 'Vũ Thảo Linh', hint: 'Master cắm hoa nghệ thuật', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800' },
    { name: 'Đặng Minh Hằng', hint: 'Cây văn nghệ và giọng ca vàng', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' },
    { name: 'Bùi Phương Uyên', hint: 'Vận động viên cầu lông của team', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800' },
    { name: 'Đỗ Hà My', hint: 'Thích đọc sách trinh thám', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800' },
    { name: 'Ngô Khánh Vy', hint: 'Thành viên trẻ trung năng động nhất', photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800' },
    { name: 'Dương Kim Ngân', hint: 'Nữ hoàng nấu ăn của công ty', photoUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=800' },
    { name: 'Lý Quỳnh Chi', hint: 'Nàng thơ phong cách vintage', photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800' },
    { name: 'Chu Thuỳ Dung', hint: 'Nghiện cafe espresso mỗi sáng', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800' },
    { name: 'Phan Thanh Trúc', hint: 'Dịu dàng, nết na và luôn lắng nghe', photoUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800' },
  ];

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

  // 4. Tạo danh sách người chơi Nam mẫu (Mật khẩu là ngày sinh)
  const sampleUsers = [
    { username: 'nguyen.nam', fullName: 'Nguyễn Hải Nam', dob: '15/03' },
    { username: 'tran.tuan', fullName: 'Trần Anh Tuấn', dob: '22/07' },
    { username: 'le.hoang', fullName: 'Lê Minh Hoàng', dob: '08/11' },
    { username: 'pham.duy', fullName: 'Phạm Đức Duy', dob: '30/01' },
    { username: 'hoang.bach', fullName: 'Hoàng Gia Bách', dob: '14/09' },
    { username: 'vu.long', fullName: 'Vũ Phi Long', dob: '05/05' },
    { username: 'dang.khoa', fullName: 'Đặng Đăng Khoa', dob: '19/12' },
    { username: 'bui.thanh', fullName: 'Bùi Tiến Thành', dob: '25/08' },
    { username: 'do.hung', fullName: 'Đỗ Mạnh Hùng', dob: '12/04' },
    { username: 'ngo.phuc', fullName: 'Ngô Hoàng Phúc', dob: '02/10' },
  ];

  for (const u of sampleUsers) {
    const hash = await bcrypt.hash(u.dob, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {
        fullName: u.fullName,
        passwordHash: hash,
      },
      create: {
        username: u.username,
        fullName: u.fullName,
        passwordHash: hash,
        role: 'PLAYER',
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
