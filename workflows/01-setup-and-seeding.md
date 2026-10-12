# Workflow 01: Thiết Lập Dữ Liệu & Seeding (Data Setup & Seeding)

## 1. Chuẩn Bị & Cấu Trúc Dữ Liệu Ban Đầu
Hệ thống yêu cầu 2 tập dữ liệu chính trước khi vận hành sự kiện:
1. **Danh sách 14 bạn Nữ**:
   - Tên đầy đủ (chính xác từng chữ để đối soát kết quả).
   - Đường dẫn ảnh chân dung (`public/photos/*.jpg` hoặc link CDN chất lượng cao).
   - Gợi ý vui / câu đố đặc trưng (Hiển thị tùy chọn trong sảnh/slide).
   - Số thứ tự câu hỏi `orderIndex` từ 1 đến 14.
2. **Danh sách người chơi Nam**:
   - `username`: Tên viết liền không dấu (VD: `nguyen.nam`, `tran.tuan`).
   - `fullName`: Tên hiển thị đầy đủ (VD: `Nguyễn Hải Nam`).
   - `password`: Ngày sinh định dạng `DDMM` (VD: ngày 15 tháng 03 nhập `1503`).
   - `role`: `PLAYER` (hoặc `ADMIN` cho MC).

---

## 2. Quy Trình Khởi Tạo Database SQLite
```bash
# 1. Đẩy cấu trúc Prisma Schema vào SQLite cục bộ (prisma/dev.db)
npx prisma db push

# 2. Thực thi script seed nạp dữ liệu mẫu
yarn seed
```

---

## 3. Quy Trình Cập Nhật / Nạp Danh Sách Thật Trước Sự Kiện
Khi Ban tổ chức có file ảnh và danh sách chính thức:
1. Copy ảnh 14 bạn nữ vào thư mục `public/photos/` đặt tên `1.jpg`, `2.jpg`, ... `14.jpg`.
2. Mở file `prisma/seed.ts` cập nhật danh sách `femaleList` và `sampleUsers`.
3. Chạy `yarn seed` để tự động băm mật khẩu `bcryptjs` và cập nhật dữ liệu vào SQLite.
4. Kiểm tra dữ liệu trực quan bằng Prisma Studio (nếu cần):
   ```bash
   npx prisma studio
   ```

---

## 4. Xử Lý Sự Cố Khi Seeding
- **Lỗi `P2002` (Unique constraint failed)**: Kiểm tra lại xem có bạn nữ nào trùng tên hoặc tài khoản nam nào bị trùng username không.
- **Lỗi sai định dạng ảnh**: Đảm bảo đường dẫn ảnh hợp lệ (tỉ lệ 4:5 hoặc 1:1) để hiển thị đẹp nhất trên mobile và máy chiếu.
