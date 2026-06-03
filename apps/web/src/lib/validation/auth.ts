/** Must contain @ and a dot in the domain part (after @). */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}

/** Jordan mobile: 9 digits, typically starts with 7 (e.g. 790000000). */
export function isValidJordanPhone(digits: string): boolean {
  const normalized = digits.replace(/\D/g, "");
  return /^7\d{8}$/.test(normalized);
}

export function normalizeJordanPhone(digits: string): string {
  return digits.replace(/\D/g, "").slice(0, 9);
}

export const JORDAN_COUNTRY_CODE = "+962";

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  percent: number;
};

/** Client-side hint only — Django still validates on submit. */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "", percent: 0 };
  }

  let points = 0;
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (/[a-z]/.test(password)) points += 1;
  if (/[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password)) points += 1;
  if (/[^a-zA-Z0-9]/.test(password)) points += 1;

  const score = Math.min(4, Math.max(1, Math.ceil((points / 6) * 4))) as
    | 1
    | 2
    | 3
    | 4;
  const labels: Record<number, string> = {
    1: "Weak",
    2: "Fair",
    3: "Good",
    4: "Strong",
  };

  return {
    score,
    label: labels[score],
    percent: score * 25,
  };
}
