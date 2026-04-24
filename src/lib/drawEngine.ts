/** Random integers between 1 and max, distinct */
function pickDistinct(count: number, max: number, rng: () => number = Math.random): number[] {
  const set = new Set<number>();
  while (set.size < count) set.add(1 + Math.floor(rng() * max));
  return [...set].sort((a, b) => a - b);
}

/** Random draw — 5 distinct numbers in 1..45 */
export function randomDraw(): number[] {
  return pickDistinct(5, 45);
}

/** Algorithmic draw weighted toward most-frequent user scores. */
export function algorithmicDraw(allScores: number[]): number[] {
  if (!allScores.length) return randomDraw();
  const freq = new Map<number, number>();
  allScores.forEach((s) => freq.set(s, (freq.get(s) ?? 0) + 1));
  // Build a weighted bag
  const bag: number[] = [];
  for (let i = 1; i <= 45; i++) {
    const w = (freq.get(i) ?? 0) + 1; // +1 base so every number is possible
    for (let j = 0; j < w; j++) bag.push(i);
  }
  const set = new Set<number>();
  while (set.size < 5) set.add(bag[Math.floor(Math.random() * bag.length)]);
  return [...set].sort((a, b) => a - b);
}

export type EntryWithUser = { user_id: string; numbers: number[] };
export type DrawResult = {
  match_5: string[];
  match_4: string[];
  match_3: string[];
};

/** Compute matches per user. Each user "entry" is their last 5 scores. */
export function computeMatches(winning: number[], entries: EntryWithUser[]): DrawResult {
  const w = new Set(winning);
  const r: DrawResult = { match_5: [], match_4: [], match_3: [] };
  for (const e of entries) {
    const matched = e.numbers.filter((n) => w.has(n)).length;
    if (matched >= 5) r.match_5.push(e.user_id);
    else if (matched === 4) r.match_4.push(e.user_id);
    else if (matched === 3) r.match_3.push(e.user_id);
  }
  return r;
}
