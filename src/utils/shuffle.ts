/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without mutating the original
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a balanced team assignment queue.
 * If totalPlayers is odd, Team A gets one extra player.
 */
export function buildShuffledQueue(totalPlayers: number): ('A' | 'B')[] {
  const halfA = Math.ceil(totalPlayers / 2);
  const halfB = Math.floor(totalPlayers / 2);
  const queue: ('A' | 'B')[] = [
    ...Array(halfA).fill('A'),
    ...Array(halfB).fill('B'),
  ];
  return shuffle(queue);
}
