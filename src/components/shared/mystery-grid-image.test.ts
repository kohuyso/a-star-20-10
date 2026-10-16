import { describe, it, expect } from 'vitest';

// Tách hàm tính toán logic của Mystery Grid để kiểm thử đơn vị
function seededShuffle(array: number[], seed: number): number[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function calculateRevealedCount({
  totalTiles,
  isQuestionActive,
  timerStartedAt,
  timerDurationSec,
  timeLeft,
  forceRevealAll,
}: {
  totalTiles: number;
  isQuestionActive: boolean;
  timerStartedAt: string | null;
  timerDurationSec: number;
  timeLeft: number;
  forceRevealAll?: boolean;
}): number {
  if (forceRevealAll) return totalTiles;
  if (!timerStartedAt) return 0;

  const duration = Math.max(1, timerDurationSec || 20);
  const revealTargetDuration = Math.max(1, duration - 10);
  const startMs = new Date(timerStartedAt).getTime();
  const elapsed = isNaN(startMs) ? 0 : Math.max(0, Math.floor((Date.now() - startMs) / 1000));

  if (!isQuestionActive) {
    if (elapsed >= duration) return totalTiles;
    return 0;
  }

  // Chống nháy lộ ảnh khi vừa bắt đầu đếm ngược
  if (elapsed <= 0 && timeLeft <= 0) {
    return 0;
  }

  const effectiveRemaining = timeLeft > 0 ? timeLeft : Math.max(0, duration - elapsed);

  if (effectiveRemaining <= 10 && elapsed >= Math.max(0, duration - 10)) {
    return totalTiles;
  }

  if (elapsed >= duration) {
    return totalTiles;
  }

  const effectiveElapsed = Math.max(0, duration - effectiveRemaining);
  const progressRatio = Math.min(1, Math.max(0, effectiveElapsed / revealTargetDuration));
  return Math.floor(progressRatio * totalTiles);
}

describe('MysteryGridImage Logic & Seeded Shuffle', () => {
  it('đảm bảo kết quả sinh ngẫu nhiên có tính tất định (deterministic) giữa máy chiếu và mobile', () => {
    const list = Array.from({ length: 25 }, (_, i) => i);
    const seed = 1 * 7919 + 101;
    const order1 = seededShuffle(list, seed);
    const order2 = seededShuffle(list, seed);

    expect(order1).toEqual(order2);
    expect(order1).toHaveLength(25);
  });

  it('các câu hỏi khác nhau sinh ra thứ tự mở ô khác nhau', () => {
    const list = Array.from({ length: 25 }, (_, i) => i);
    const orderQ1 = seededShuffle(list, 1 * 7919 + 101);
    const orderQ2 = seededShuffle(list, 2 * 7919 + 101);

    expect(orderQ1).not.toEqual(orderQ2);
  });

  it('khi chưa bắt đầu đếm ngược (timerStartedAt = null), tuyệt đối không mở ô nào (0 ô mở)', () => {
    const revealed = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: false,
      timerStartedAt: null,
      timerDurationSec: 30,
      timeLeft: 0,
    });
    expect(revealed).toBe(0);
  });

  it('CHỐNG NHÁY LỘ ẢNH: khi vừa bắt đầu đếm ngược (elapsed <= 0s), dù timeLeft truyền vào ban đầu là 0 vẫn không mở ô nào', () => {
    const revealed = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date().toISOString(), // vừa tạo lúc này
      timerDurationSec: 20,
      timeLeft: 0, // bị trễ 1 render cycle của state
    });
    expect(revealed).toBe(0);
  });

  it('khi isQuestionActive = false và chưa kết thúc đếm ngược, không bao giờ lộ ảnh dù timeLeft = 0', () => {
    const revealed = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: false,
      timerStartedAt: null,
      timerDurationSec: 20,
      timeLeft: 0,
    });
    expect(revealed).toBe(0);
  });

  it('khi thời gian còn lại > 10s, số ô mở tăng dần theo thời gian', () => {
    // Tổng 30s: thời gian mở là 20s (từ 30s về 10s)
    const revealedAtStart = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date().toISOString(),
      timerDurationSec: 30,
      timeLeft: 30, // elapsed = 0
    });
    expect(revealedAtStart).toBe(0);

    const revealedAtMid = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date(Date.now() - 10000).toISOString(),
      timerDurationSec: 30,
      timeLeft: 20, // elapsed = 10s -> 50%
    });
    expect(revealedAtMid).toBe(12); // Math.floor(0.5 * 25) = 12
  });

  it('trước 10s so với thời gian kết thúc (timeLeft <= 10s), toàn bộ 25 ô đã mở 100%', () => {
    const revealedAt10s = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date(Date.now() - 20000).toISOString(),
      timerDurationSec: 30,
      timeLeft: 10,
    });
    expect(revealedAt10s).toBe(25);

    const revealedAt5s = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date(Date.now() - 25000).toISOString(),
      timerDurationSec: 30,
      timeLeft: 5,
    });
    expect(revealedAt5s).toBe(25);

    const revealedAtEnd = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: true,
      timerStartedAt: new Date(Date.now() - 30000).toISOString(),
      timerDurationSec: 30,
      timeLeft: 0,
    });
    expect(revealedAtEnd).toBe(25);
  });

  it('khi forceRevealAll = true, toàn bộ 25 ô được mở', () => {
    const revealed = calculateRevealedCount({
      totalTiles: 25,
      isQuestionActive: false,
      timerStartedAt: null,
      timerDurationSec: 20,
      timeLeft: 20,
      forceRevealAll: true,
    });
    expect(revealed).toBe(25);
  });
});
