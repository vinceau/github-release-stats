/**
 * Returns the seconds elapsed since a specific time.
 *
 * @export
 * @param {Date} before The date to compare with
 * @returns {number}
 */
export function secondsElapsed(before: Date): number {
  const now = new Date();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elapsedSeconds = ((now as any) - (before as any)) / 1000;
  return elapsedSeconds;
}
