export function formatDurationLabel(totalSeconds?: number | null) {
  if (!totalSeconds) return null;

  const totalMinutes = Math.round(Math.max(0, totalSeconds) / 60);

  if (totalMinutes < 60) return `${totalMinutes}m`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}
