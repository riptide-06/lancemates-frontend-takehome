/** Pragmatic email check: something@something.tld — good enough for a form, not for an RFC. */
export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One special character', test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

export const isStrongPassword = (password: string) =>
  passwordRules.every((rule) => rule.test(password));

export const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return 'Enter your email address.';
  if (!isValidEmail(value)) return 'That doesn’t look like an email address.';
  return undefined;
};

export const validateName = (value: string): string | undefined => {
  if (!value.trim()) return 'Enter your name.';
  if (value.trim().length < 2) return 'Your name needs at least 2 characters.';
  return undefined;
};

export const validateLoginPassword = (value: string): string | undefined =>
  value ? undefined : 'Enter your password.';

export const validateSignUpPassword = (value: string): string | undefined => {
  if (!value) return 'Choose a password.';
  if (!isStrongPassword(value)) return 'Your password doesn’t meet all the rules yet.';
  return undefined;
};

/** Small helper so a simulated request feels like a request. */
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
