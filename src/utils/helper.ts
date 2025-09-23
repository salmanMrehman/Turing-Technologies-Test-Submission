export function toMinutesSeconds(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds)); // clamp & floor
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return { minutes, seconds };
}

export function formatMinutesSeconds(totalSeconds: number) {
  const { minutes, seconds } = toMinutesSeconds(totalSeconds);
  const m = minutes === 1 ? 'minute' : 'minutes';
  const s = seconds === 1 ? 'second' : 'seconds';
  return `${minutes} ${m} ${seconds} ${s}`;
}