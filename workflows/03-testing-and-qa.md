# Workflow 03: Kiểm Thử & Đảm Bảo Chất Lượng (Testing & QA)

## 1. Unit Tests cho Thuật Toán Trao Quà (Epic D4)
Thuật toán chọn người trao quà là trái tim của trò chơi, cần được test 100% các kịch bản:
- Trường hợp chuẩn: Nhiều người đoán đúng $\rightarrow$ chọn người có `answeredAt` sớm nhất.
- Trường hợp người nhanh nhất đã nhận quà ở vòng trước $\rightarrow$ chọn người nhanh thứ 2.
- Trường hợp không ai đoán đúng $\rightarrow$ chọn người đoán sai sớm nhất chưa nhận quà.
- Trường hợp tất cả người đoán sai/đúng đều đã nhận quà $\rightarrow$ trả về `MANUAL` (MC chọn tay).
- Ràng buộc không bao giờ trao quà 2 lần cho cùng 1 người.

Lệnh chạy unit test:
```bash
yarn vitest run
```

## 2. Type Check & Linting
```bash
yarn tsc --noEmit
yarn lint
```
