# Astar 20/10 – Mô Hình Dữ Liệu & SQLite Schema

## 1. Sơ đồ Quan Hệ Thực Thể (ERD)

```mermaid
erDiagram
    User ||--o{ Vote : submits
    Question ||--o{ Vote : receives
    Question ||--o| FemaleProfile : represents
    RoundResult ||--|| FemaleProfile : awards
    RoundResult ||--o| User : winner

    User {
        string id PK
        string username UK
        string passwordHash
        string fullName
        string role "PLAYER | ADMIN"
        datetime createdAt
    }

    FemaleProfile {
        string id PK
        string name UK
        string avatarUrl
        string hint
        int orderIndex
    }

    Question {
        string id PK
        int questionNumber UK
        string femaleProfileId FK
        string photoUrl
        boolean isActive
    }

    Vote {
        string id PK
        string userId FK
        string questionId FK
        string selectedName
        boolean isCorrect
        datetime answeredAt
    }

    GameState {
        string id PK "singleton: default"
        string status "LOBBY | VOTING | CLOSED | REVEAL"
        int currentQuestionNumber "1 to 14"
        boolean isQuestionActive "Admin mở/khóa nhận câu trả lời"
        int timerDurationSec "Thời gian đếm ngược (giây)"
        datetime timerStartedAt "Mốc bắt đầu đếm ngược"
        int currentSlideIndex
        int activeRevealRound
        int slideDurationSec
        datetime updatedAt
    }

    RoundResult {
        string id PK
        string femaleProfileId FK
        string assignedUserId FK "nullable if manual / none"
        int totalCorrectGuesses
        int totalGuesses
        string selectionReason "FASTEST_CORRECT | FASTEST_INCORRECT | MANUAL"
        datetime revealedAt
    }
```

## 2. Ràng Buộc Cơ Sở Dữ Liệu (Constraints & Indexes)
1. **Unique Index `(userId, selectedName)`**: Ngăn người chơi chọn 1 tên 2 lần trong 1 phiên.
2. **Unique Index `(userId, questionId)`**: Ngăn người chơi trả lời 2 lần cho cùng 1 câu hỏi.
3. **Index `(questionId, isCorrect, answeredAt ASC)`**: Tối ưu hóa truy vấn người đoán đúng/sai nhanh nhất cho từng câu.
