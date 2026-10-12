# Workflow 02: Vận Hành Vòng Game Thực Tế (Game Operation Flow)

## 1. Kịch Bản Vận Hành 5 Giai Đoạn

```mermaid
sequenceDiagram
    autonumber
    actor MC as Admin / MC
    participant Laptop as Máy Chủ Local (Laptop Admin)
    actor Projector as Màn Hình Chiếu Lớn
    actor Players as 30-40 Người Chơi Nam (Mobile)

    Note over MC,Players: GIAI ĐOẠN 1: SẢNH CHỜ (LOBBY)
    MC->>Laptop: Khởi động Next.js (`yarn dev` hoặc `yarn start`)
    MC->>Projector: Mở trang `/admin` hoặc `/lobby` (Hiện mã QR + IP LAN)
    Players->>Laptop: Quét QR vào `http://<LAN-IP>:3000/login` & đăng nhập

    Note over MC,Players: GIAI ĐOẠN 2: CHIẾU ẢNH (SLIDESHOW)
    MC->>Laptop: Bấm "Bắt đầu Chiếu ảnh" (`status = SLIDESHOW`)
    Projector->>Projector: Chiếu tự động 14 ảnh (15s/ảnh, có đếm ngược)
    Players->>Players: Màn hình điện thoại hiện banner "Đang chiếu ảnh, chờ mở vote"

    Note over MC,Players: GIAI ĐOẠN 3: BỎ PHIẾU (VOTING)
    MC->>Laptop: Bấm "MỞ VOTE NGAY" (`status = VOTING`)
    Players->>Laptop: Điện thoại nhảy sang Câu 1 -> Chọn tên -> Bấm "Chọn" (14 câu)
    Laptop->>Laptop: Ghi nhận timestamp `answered_at` tại server
    Laptop->>MC: Cập nhật thanh tiến độ trực tiếp (VD: 32/40 đã nộp)

    Note over MC,Players: GIAI ĐOẠN 4: ĐÓNG VOTE (CLOSED)
    MC->>Laptop: Bấm "ĐÓNG VOTE" (`status = CLOSED`)
    Laptop->>Laptop: Khóa cổng submit, tính toán thuật toán D4

    Note over MC,Players: GIAI ĐOẠN 5: CÔNG BỐ KẾT QUẢ (REVEAL)
    MC->>Projector: Chuyển màn hình sang `/results`
    loop 14 Vòng (Từ bạn nữ ít người đoán đúng nhất -> nhiều nhất)
        MC->>Projector: Bấm "Công bố tiếp"
        Projector->>Projector: Hiệu ứng Lật thẻ + Pháo hoa + Highlight người trao quà (D4)
        Note over MC,Players: Người trúng giải lên trao quà cho bạn nữ
    end
```

---

## 2. Thao Tác Chi Tiết Cho Từng Vai Trò

### 2.1. Đối với MC / Admin
1. **Kiểm tra trước giờ G:**
   - Laptop kết nối Wi-Fi công ty, cắm dây HDMI lên máy chiếu.
   - Bật app, kiểm tra mã QR kết nối hiển thị đúng IP Wi-Fi nội bộ.
2. **Trong lúc chơi:**
   - Quan sát bảng *"Tiến độ người chơi"* trên màn hình `/admin`.
   - Nhắc nhở những ai đang ở trạng thái *"Đang làm"* hoặc *"Chưa vào"*.
3. **Khi công bố kết quả (`/results`):**
   - Bấm phím cách (Space) hoặc click nút *"Công bố tiếp"* để lật mở từng bạn nữ.
   - Nếu xảy ra tình huống đặc biệt (người trao quà vắng mặt / hết người), MC có thể chỉ định người thay thế thủ công.

### 2.2. Đối với Người Chơi Nam (Mobile)
1. Quét mã QR trên màn chiếu để vào trang đăng nhập.
2. Nhập họ tên và ngày sinh (4 chữ số `DDMM`).
3. Khi cổng vote mở: Xem ảnh, chọn 1 tên duy nhất trong danh sách $\rightarrow$ bấm *"Chọn"*.
4. Sau khi hoàn thành câu 14: Xem màn hình xác nhận *"Đã hoàn tất, hãy hướng mắt về sân khấu"*.

---

## 3. Kế Hoạch Ứng Phó Sự Cố (Contingency Plan)

| Sự cố | Cách khắc phục ngay lập tức |
| :--- | :--- |
| **Người chơi bị mất mạng Wi-Fi hoặc lỡ tắt trình duyệt** | Mở lại trình duyệt $\rightarrow$ Hệ thống tự động phục hồi đúng câu đang làm dở (Tiến độ lưu tại Server SQLite). |
| **Máy chiếu bị lỏng dây hoặc reload trang `/results`** | Kết quả các vòng đã mở được lưu trong SQLite (`RoundResult`), trang sẽ load lại đúng vòng hiện tại mà không bị nhảy lùi. |
| **Muốn tổ chức chơi thử nghiệm trước buổi tiệc** | Admin bấm nút *"Reset game"* trên bảng điều khiển để xóa sạch dữ liệu vote thử và đưa phòng về trạng thái ban đầu. |
