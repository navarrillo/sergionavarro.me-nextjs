export const BIRTH_DATE = "1994-04-26";

export function ageFromBirthDate(now: Date = new Date()): number {
  const [year, month, day] = BIRTH_DATE.split("-").map(Number);
  let age = now.getFullYear() - year;
  const monthIndex = month - 1;
  if (
    now.getMonth() < monthIndex ||
    (now.getMonth() === monthIndex && now.getDate() < day)
  ) {
    age -= 1;
  }
  return age;
}
