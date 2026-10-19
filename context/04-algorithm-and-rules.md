# Astar 20/10 – Đặc Tả Thuật Toán Công Bố & Trao Quà (Epic D4)

## 1. Mục Tiêu Nghiệp Vụ
- Đảm bảo tính công bằng, hồi hộp, kịch tính cho sự kiện 20/10.
- Mỗi bạn nữ (14 bạn) sẽ có một người nam tương ứng lên trao quà.
- Thứ tự công bố: Từ bạn nữ "bí ẩn nhất" (ít người đoán đúng nhất) đến bạn nữ "dễ nhận diện nhất" (nhiều người đoán đúng nhất).
- Mỗi người chơi nam chỉ được trao quà **tối đa 1 lần** (để chia đều cơ hội cho mọi người).

---

## 2. Các Bước Thực Hiện Thuật Toán

### Bước 1: Tính toán thống kê & Sắp xếp danh sách Công bố
- Với mỗi câu hỏi $Q_k$ tương ứng bạn nữ $F_k$:
  - Đếm tổng số lượt đoán đúng: $C_k = \sum [isCorrect = true]$.
- Sắp xếp 14 bạn nữ theo thứ tự tăng dần của $C_k$:
  - Khóa chính: $C_k$ (ASC)
  - Khóa phụ: `orderIndex` (ASC) nếu 2 bạn nữ có cùng số người đoán đúng (Giả định 1).

### Bước 2: Duyệt từng bạn nữ và Chọn Người Trao Quà
Duy trì danh sách `assignedUserIds = Set<string>()` (những người đã được chọn trao quà ở các vòng trước).

Với bạn nữ hiện tại $F_k$:
1. Lọc danh sách lượt vote của câu hỏi $Q_k$:
   - $V_k = \{ v \in Votes(Q_k) \mid v.userId \notin assignedUserIds \}$
2. **Xét Ưu tiên 1 (Đoán đúng nhanh nhất)**:
   - $V_{correct} = \{ v \in V_k \mid v.isCorrect = true \}$
   - Sắp xếp $V_{correct}$ theo `answeredAt` ASC.
   - Nếu $V_{correct}$ không rỗng $\rightarrow$ Chọn $v^* = V_{correct}[0]$. Lý do: `FASTEST_CORRECT`.
3. **Xét Ưu tiên 2 (Đoán sai nhanh nhất)**:
   - Nếu $V_{correct}$ rỗng:
   - $V_{incorrect} = \{ v \in V_k \mid v.isCorrect = false \}$
   - Sắp xếp $V_{incorrect}$ theo `answeredAt` ASC.
   - Nếu $V_{incorrect}$ không rỗng $\rightarrow$ Chọn $v^* = V_{incorrect}[0]$. Lý do: `FASTEST_INCORRECT`.
4. **Xét Ưu tiên 3 (BẮT BUỘC CÓ NGƯỜI TẶNG - Fallback chọn Nam chưa tặng lần nào)**:
   - Nếu cả 2 ưu tiên trên không tìm ra ai (do câu này chưa có ai vote, hoặc tất cả người vote đều đã nhận giải trước đó / là nữ):
   - **Bắt buộc phải có 1 người lên tặng quà**: Chọn ra 1 bạn nam từ danh sách người chơi nam chưa lên tặng lần nào:
     $U_{unassigned} = \{ u \in Users \mid u.gender \neq 'FEMALE' \wedge u.id \notin assignedUserIds \}$
   - Nếu $U_{unassigned}$ không rỗng: Chọn bạn nam đầu tiên (sắp xếp deterministic theo username). Lý do: `LUCKY_FALLBACK`.
   - Nếu ngay cả $U_{unassigned}$ cũng rỗng (toàn bộ nam trong phòng đều đã trao quà): Để trống `assignedUserId = null`, Lý do: `MANUAL` / `NO_VOTES`.
5. Nếu tìm được người trao quà:
   - Thêm `userId` vào `assignedUserIds`.
   - Lưu kết quả vòng vào bảng `RoundResult`.

---

## 3. Các Trường Hợp Biên (Edge Cases)

| STT | Trường Hợp | Cách Xử Lý |
| :--- | :--- | :--- |
| 1 | Hai người có cùng `answeredAt` đến mili-giây | Sắp xếp phụ theo `vote.id` hoặc thời gian tạo bản ghi để deterministic. |
| 2 | Người chơi không hoàn thành đủ 14 câu trước khi đóng vote | Chỉ các câu đã bấm "Chọn" (đã có `answeredAt`) mới được đưa vào tính toán. Các câu chưa làm bị bỏ qua (Giả định 3). |
| 3 | Người đoán đúng nhanh nhất của câu này đã trúng giải ở câu trước | Tự động chuyển sang người đoán đúng nhanh thứ 2 (chưa nhận giải). |
| 4 | Toàn bộ phòng chơi không ai đoán đúng câu này | Người đoán sai nhanh nhất (chưa nhận giải) sẽ được trao giải may mắn. |
| 5 | MC đổi máy chiếu hoặc reload trang | Kết quả các vòng đã mở được lưu trong SQLite (`RoundResult`) và phục hồi tức thì. |
