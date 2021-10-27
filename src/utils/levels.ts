export function normalizeLevel(level?: number) {
  return (Number.isNaN(level) || level === undefined) ? 0 : Number(level.toFixed(2));
}
