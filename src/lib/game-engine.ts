export type SelectionReason = 'FASTEST_CORRECT' | 'FASTEST_INCORRECT' | 'MANUAL' | 'NO_VOTES';

export interface FemaleProfileInput {
  id: string;
  name: string;
  orderIndex: number;
  avatarUrl?: string | null;
  hint?: string | null;
}

export interface QuestionInput {
  id: string;
  questionNumber: number;
  femaleProfileId: string;
  photoUrl: string;
}

export interface VoteInput {
  id: string;
  userId: string;
  questionId: string;
  selectedName: string;
  isCorrect: boolean;
  answeredAt: Date | string;
}

export interface UserInput {
  id: string;
  username: string;
  fullName: string;
}

export interface RevealRoundResult {
  femaleProfileId: string;
  femaleName: string;
  orderIndex: number;
  questionId: string;
  questionNumber: number;
  photoUrl: string;
  femaleHint?: string | null;
  totalCorrectGuesses: number;
  totalGuesses: number;
  assignedUserId: string | null;
  assignedUserName: string | null;
  selectionReason: SelectionReason;
  answeredAt: Date | null;
  allVotes: Array<{
    userId: string;
    userName: string;
    selectedName: string;
    isCorrect: boolean;
    answeredAt: Date;
    wasPreviouslyAssigned: boolean;
  }>;
}

/**
 * Thuật toán Epic D4: Tính toán phân bổ người trao quà cho từng bạn nữ
 */
export function calculateRevealRounds(params: {
  femaleProfiles: FemaleProfileInput[];
  questions: QuestionInput[];
  votes: VoteInput[];
  users: UserInput[];
  initialAssignedUserIds?: string[];
  sortBy?: 'QUESTION_NUMBER' | 'DIFFICULTY';
}): RevealRoundResult[] {
  const {
    femaleProfiles,
    questions,
    votes,
    users,
    initialAssignedUserIds = [],
    sortBy = 'DIFFICULTY',
  } = params;

  const userMap = new Map<string, UserInput>();
  users.forEach((u) => userMap.set(u.id, u));

  const questionByFemaleMap = new Map<string, QuestionInput>();
  questions.forEach((q) => questionByFemaleMap.set(q.femaleProfileId, q));

  // 1. Thống kê số lượt đoán đúng cho mỗi bạn nữ
  const femaleStats = femaleProfiles.map((female) => {
    const question = questionByFemaleMap.get(female.id);
    if (!question) {
      throw new Error(`Không tìm thấy câu hỏi tương ứng cho bạn nữ ${female.name} (${female.id})`);
    }

    const questionVotes = votes.filter((v) => v.questionId === question.id);
    const correctVotes = questionVotes.filter((v) => v.isCorrect);

    return {
      female,
      question,
      correctCount: correctVotes.length,
      totalCount: questionVotes.length,
    };
  });

  // 2. Sắp xếp thứ tự: Theo số thứ tự câu hỏi (1 -> 14) hoặc theo độ khó (ít đúng nhất -> nhiều)
  if (sortBy === 'DIFFICULTY') {
    femaleStats.sort((a, b) => {
      if (a.correctCount !== b.correctCount) {
        return a.correctCount - b.correctCount;
      }
      return a.question.questionNumber - b.question.questionNumber;
    });
  } else {
    femaleStats.sort((a, b) => a.question.questionNumber - b.question.questionNumber);
  }

  // 3. Phân bổ người trao quà
  const assignedUserIds = new Set<string>(initialAssignedUserIds);
  const results: RevealRoundResult[] = [];

  for (const item of femaleStats) {
    const { female, question, correctCount, totalCount } = item;
    const questionVotes = votes
      .filter((v) => v.questionId === question.id)
      .map((v) => ({
        ...v,
        answeredAtDate: new Date(v.answeredAt),
      }))
      .sort((a, b) => a.answeredAtDate.getTime() - b.answeredAtDate.getTime());

    // Các ứng viên chưa từng nhận/trao quà ở các câu trước
    const eligibleVotes = questionVotes.filter((v) => !assignedUserIds.has(v.userId));

    let selectedWinner: (typeof questionVotes)[0] | null = null;
    let reason: SelectionReason = 'MANUAL';

    if (totalCount === 0) {
      reason = 'NO_VOTES';
      selectedWinner = null;
    } else {
      // Ưu tiên 1: Đoán đúng sớm nhất
      const correctCandidates = eligibleVotes.filter((v) => v.isCorrect);
      if (correctCandidates.length > 0) {
        selectedWinner = correctCandidates[0];
        reason = 'FASTEST_CORRECT';
      } else {
        // Ưu tiên 2: Đoán sai sớm nhất
        const incorrectCandidates = eligibleVotes.filter((v) => !v.isCorrect);
        if (incorrectCandidates.length > 0) {
          selectedWinner = incorrectCandidates[0];
          reason = 'FASTEST_INCORRECT';
        } else {
          selectedWinner = null;
          reason = 'MANUAL';
        }
      }
    }

    if (selectedWinner) {
      assignedUserIds.add(selectedWinner.userId);
    }

    results.push({
      femaleProfileId: female.id,
      femaleName: female.name,
      orderIndex: female.orderIndex,
      questionId: question.id,
      questionNumber: question.questionNumber,
      photoUrl: question.photoUrl,
      femaleHint: female.hint,
      totalCorrectGuesses: correctCount,
      totalGuesses: totalCount,
      assignedUserId: selectedWinner ? selectedWinner.userId : null,
      assignedUserName: selectedWinner ? userMap.get(selectedWinner.userId)?.fullName || null : null,
      selectionReason: reason,
      answeredAt: selectedWinner ? selectedWinner.answeredAtDate : null,
      allVotes: questionVotes.map((v) => ({
        userId: v.userId,
        userName: userMap.get(v.userId)?.fullName || 'Ẩn danh',
        selectedName: v.selectedName,
        isCorrect: v.isCorrect,
        answeredAt: v.answeredAtDate,
        wasPreviouslyAssigned: assignedUserIds.has(v.userId) && v.userId !== selectedWinner?.userId,
      })),
    });
  }

  return results;
}
