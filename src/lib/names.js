/** Canonical player-name key: lowercase, curly quotes straightened, dots/dashes stripped. */
export const norm = (s) => (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[.-]/g, "").trim();

/** Looser key for fuzzy matching ("Jamarr Chase" → "Ja'Marr Chase"): alphanumerics + single spaces only. */
export const loose = (s) => norm(s).replace(/[^a-z0-9 ]+/g, "").replace(/\s+/g, " ").trim();

/** Levenshtein distance, short-circuiting to 3 when lengths differ by more than 2. */
export function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

/** Key used for board entries — same as `norm`. */
export const boardKey = norm;
