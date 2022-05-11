export function normalizeLevel(level?: number) {
  return (Number.isNaN(level) || level === undefined) ? NaN : Number(level.toFixed(2));
}
