import { describe, it, expect } from 'vitest';
import { calculateRevealRounds, FemaleProfileInput, QuestionInput, UserInput, VoteInput } from './game-engine';

describe('Epic D4: calculateRevealRounds', () => {
  const mockFemales: FemaleProfileInput[] = [
    { id: 'f1', name: 'Nguyễn Thị A', orderIndex: 1 },
    { id: 'f2', name: 'Trần Thị B', orderIndex: 2 },
    { id: 'f3', name: 'Lê Thị C', orderIndex: 3 },
  ];

  const mockQuestions: QuestionInput[] = [
    { id: 'q1', questionNumber: 1, femaleProfileId: 'f1', photoUrl: '/photos/1.jpg' },
    { id: 'q2', questionNumber: 2, femaleProfileId: 'f2', photoUrl: '/photos/2.jpg' },
    { id: 'q3', questionNumber: 3, femaleProfileId: 'f3', photoUrl: '/photos/3.jpg' },
  ];

  const mockUsers: UserInput[] = [
    { id: 'u1', username: 'nam1', fullName: 'Nguyễn Văn Nam 1' },
    { id: 'u2', username: 'nam2', fullName: 'Trần Văn Nam 2' },
    { id: 'u3', username: 'nam3', fullName: 'Lê Văn Nam 3' },
    { id: 'u4', username: 'nam4', fullName: 'Phạm Văn Nam 4' },
  ];

  it('sắp xếp thứ tự công bố từ bạn nữ có ít người đoán đúng nhất lên trước', () => {
    // q1: 2 đúng, q2: 0 đúng, q3: 1 đúng
    const votes: VoteInput[] = [
      // q1: u1 đúng, u2 đúng
      { id: 'v1', userId: 'u1', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:10Z' },
      { id: 'v2', userId: 'u2', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:20Z' },
      // q2: u1 sai, u2 sai
      { id: 'v3', userId: 'u1', questionId: 'q2', selectedName: 'Lê Thị C', isCorrect: false, answeredAt: '2026-10-09T10:01:10Z' },
      { id: 'v4', userId: 'u2', questionId: 'q2', selectedName: 'Lê Thị C', isCorrect: false, answeredAt: '2026-10-09T10:01:20Z' },
      // q3: u1 đúng, u2 sai
      { id: 'v5', userId: 'u1', questionId: 'q3', selectedName: 'Lê Thị C', isCorrect: true, answeredAt: '2026-10-09T10:02:10Z' },
      { id: 'v6', userId: 'u2', questionId: 'q3', selectedName: 'Trần Thị B', isCorrect: false, answeredAt: '2026-10-09T10:02:20Z' },
    ];

    const results = calculateRevealRounds({
      femaleProfiles: mockFemales,
      questions: mockQuestions,
      votes,
      users: mockUsers,
    });

    // Thứ tự đúng phải là: f2 (0 đúng) -> f3 (1 đúng) -> f1 (2 đúng)
    expect(results.map((r) => r.femaleProfileId)).toEqual(['f2', 'f3', 'f1']);
    expect(results[0].totalCorrectGuesses).toBe(0);
    expect(results[1].totalCorrectGuesses).toBe(1);
    expect(results[2].totalCorrectGuesses).toBe(2);
  });

  it('ưu tiên 1: chọn người đoán đúng câu đó sớm nhất', () => {
    const votes: VoteInput[] = [
      // q1: u2 trả lời đúng lúc 10:00:05, u1 trả lời đúng lúc 10:00:10
      { id: 'v1', userId: 'u1', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:10Z' },
      { id: 'v2', userId: 'u2', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:05Z' },
    ];

    const results = calculateRevealRounds({
      femaleProfiles: [mockFemales[0]],
      questions: [mockQuestions[0]],
      votes,
      users: mockUsers,
    });

    expect(results[0].assignedUserId).toBe('u2');
    expect(results[0].selectionReason).toBe('FASTEST_CORRECT');
  });

  it('loại trừ người đã được chọn ở vòng trước và trao cho người đúng sớm tiếp theo', () => {
    const votes: VoteInput[] = [
      // f2 (0 đúng): u1 đoán sai sớm nhất (10:00:01) -> u1 được chọn cho f2
      { id: 'v1', userId: 'u1', questionId: 'q2', selectedName: 'X', isCorrect: false, answeredAt: '2026-10-09T10:00:01Z' },
      { id: 'v2', userId: 'u2', questionId: 'q2', selectedName: 'Y', isCorrect: false, answeredAt: '2026-10-09T10:00:05Z' },

      // f1 (2 đúng): u1 đúng sớm nhất (10:00:10) nhưng ĐÃ ĐƯỢC CHỌN CHO F2 -> u2 đúng lúc (10:00:15) sẽ được chọn!
      { id: 'v3', userId: 'u1', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:10Z' },
      { id: 'v4', userId: 'u2', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:15Z' },
    ];

    const results = calculateRevealRounds({
      femaleProfiles: [mockFemales[0], mockFemales[1]],
      questions: [mockQuestions[0], mockQuestions[1]],
      votes,
      users: mockUsers,
    });

    // Vòng 1: f2 -> u1
    expect(results[0].femaleProfileId).toBe('f2');
    expect(results[0].assignedUserId).toBe('u1');
    expect(results[0].selectionReason).toBe('FASTEST_INCORRECT');

    // Vòng 2: f1 -> u2 (do u1 đã nhận f2)
    expect(results[1].femaleProfileId).toBe('f1');
    expect(results[1].assignedUserId).toBe('u2');
    expect(results[1].selectionReason).toBe('FASTEST_CORRECT');
  });

  it('ưu tiên 2: nếu không ai đoán đúng, chọn người đoán sai sớm nhất chưa nhận quà', () => {
    const votes: VoteInput[] = [
      { id: 'v1', userId: 'u3', questionId: 'q1', selectedName: 'Sai', isCorrect: false, answeredAt: '2026-10-09T10:00:20Z' },
      { id: 'v2', userId: 'u4', questionId: 'q1', selectedName: 'Sai', isCorrect: false, answeredAt: '2026-10-09T10:00:05Z' },
    ];

    const results = calculateRevealRounds({
      femaleProfiles: [mockFemales[0]],
      questions: [mockQuestions[0]],
      votes,
      users: mockUsers,
    });

    expect(results[0].assignedUserId).toBe('u4');
    expect(results[0].selectionReason).toBe('FASTEST_INCORRECT');
  });

  it('ưu tiên 3 (fallback): nếu tất cả người chơi đều đã nhận quà, trả về MANUAL để MC chỉ định', () => {
    const votes: VoteInput[] = [
      { id: 'v1', userId: 'u1', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:10Z' },
    ];

    // Giả sử u1 đã được chọn từ trước
    const results = calculateRevealRounds({
      femaleProfiles: [mockFemales[0]],
      questions: [mockQuestions[0]],
      votes,
      users: mockUsers,
      initialAssignedUserIds: ['u1'],
    });

    expect(results[0].assignedUserId).toBeNull();
    expect(results[0].selectionReason).toBe('MANUAL');
  });

  it('người trao quà chỉ có thể là nam: người chơi nữ đoán đúng nhanh nhất vẫn không được chọn trao quà', () => {
    const mixedUsers: UserInput[] = [
      { id: 'f_player', username: 'female1', fullName: 'Phạm Thị Nữ', gender: 'FEMALE' },
      { id: 'm_player', username: 'male1', fullName: 'Trần Văn Nam', gender: 'MALE' },
    ];

    const votes: VoteInput[] = [
      // f_player đoán đúng siêu nhanh (10:00:01)
      { id: 'v1', userId: 'f_player', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:01Z' },
      // m_player đoán đúng sau (10:00:08)
      { id: 'v2', userId: 'm_player', questionId: 'q1', selectedName: 'Nguyễn Thị A', isCorrect: true, answeredAt: '2026-10-09T10:00:08Z' },
    ];

    const results = calculateRevealRounds({
      femaleProfiles: [mockFemales[0]],
      questions: [mockQuestions[0]],
      votes,
      users: mixedUsers,
    });

    // Lượt vote của bạn nữ vẫn được thống kê và xuất hiện trong allVotes
    expect(results[0].totalCorrectGuesses).toBe(2);
    expect(results[0].allVotes.length).toBe(2);
    // Nhưng người được chọn trao quà BẮT BUỘC phải là bạn nam (m_player)
    expect(results[0].assignedUserId).toBe('m_player');
    expect(results[0].assignedUserName).toBe('Trần Văn Nam');
    expect(results[0].selectionReason).toBe('FASTEST_CORRECT');
  });
});
