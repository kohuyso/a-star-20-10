export type SelectionReason = 'FASTEST_CORRECT' | 'FASTEST_INCORRECT' | 'LUCKY_FALLBACK' | 'MANUAL' | 'NO_VOTES';

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
  gender?: string; // 'MALE' | 'FEMALE'
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

    // Các ứng viên chưa từng nhận/trao quà ở các câu trước VÀ là NAM (người trao quà chỉ có thể là nam)
    const eligibleVotes = questionVotes.filter((v) => {
      if (assignedUserIds.has(v.userId)) return false;
      const user = userMap.get(v.userId);
      // Nữ có thể đoán nhưng người trao quà chỉ có thể là nam
      if (user?.gender === 'FEMALE') return false;
      return true;
    });

    let assignedUserId: string | null = null;
    let assignedUserName: string | null = null;
    let reason: SelectionReason = 'MANUAL';
    let answeredAtDate: Date | null = null;

    // Ưu tiên 1: Đoán đúng sớm nhất
    const correctCandidates = eligibleVotes.filter((v) => v.isCorrect);
    if (correctCandidates.length > 0) {
      const winnerVote = correctCandidates[0];
      assignedUserId = winnerVote.userId;
      assignedUserName = userMap.get(winnerVote.userId)?.fullName || null;
      reason = 'FASTEST_CORRECT';
      answeredAtDate = winnerVote.answeredAtDate;
    } else {
      // Ưu tiên 2: Đoán sai sớm nhất
      const incorrectCandidates = eligibleVotes.filter((v) => !v.isCorrect);
      if (incorrectCandidates.length > 0) {
        const winnerVote = incorrectCandidates[0];
        assignedUserId = winnerVote.userId;
        assignedUserName = userMap.get(winnerVote.userId)?.fullName || null;
        reason = 'FASTEST_INCORRECT';
        answeredAtDate = winnerVote.answeredAtDate;
      } else {
        // Ưu tiên 3 (FALLBACK BẮT BUỘC):
        // Nếu các điều kiện hiện tại không tìm ra ai, chọn ra 1 người là nam từ danh sách người chơi chưa lên tặng lần nào
        const unassignedMales = users
          .filter((u) => u.gender !== 'FEMALE' && !assignedUserIds.has(u.id))
          .sort((a, b) => a.username.localeCompare(b.username));

        if (unassignedMales.length > 0) {
          const fallbackWinner = unassignedMales[0];
          assignedUserId = fallbackWinner.id;
          assignedUserName = fallbackWinner.fullName;
          reason = 'LUCKY_FALLBACK';
          const userVoteForQ = questionVotes.find((v) => v.userId === fallbackWinner.id);
          answeredAtDate = userVoteForQ ? userVoteForQ.answeredAtDate : null;
        } else {
          // Chỉ khi toàn bộ người chơi nam trong phòng đều đã được gán lên tặng quà
          assignedUserId = null;
          assignedUserName = null;
          reason = totalCount === 0 ? 'NO_VOTES' : 'MANUAL';
          answeredAtDate = null;
        }
      }
    }

    if (assignedUserId) {
      assignedUserIds.add(assignedUserId);
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
      assignedUserId,
      assignedUserName,
      selectionReason: reason,
      answeredAt: answeredAtDate,
      allVotes: questionVotes.map((v) => ({
        userId: v.userId,
        userName: userMap.get(v.userId)?.fullName || 'Ẩn danh',
        selectedName: v.selectedName,
        isCorrect: v.isCorrect,
        answeredAt: v.answeredAtDate,
        wasPreviouslyAssigned: assignedUserIds.has(v.userId) && v.userId !== assignedUserId,
      })),
    });
  }

  return results;
}
