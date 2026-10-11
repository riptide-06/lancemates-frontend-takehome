import { Platform } from 'react-native';

/**
 * Lancemates design tokens.
 *
 * The brand system is "rings and dots": rings are your neighbourhood radius,
 * dots are the mates inside it. Green is the working colour (it's a
 * marketplace, it should feel trustworthy), marigold is reserved for the
 * one thing that matters on a screen — usually "you".
 */
export const colors = {
  ink: '#0F2A20', // deep spruce — headlines and primary text
  inkSoft: '#4E625A', // secondary text
  inkFaint: '#8A9992', // placeholders, tertiary text
  clover: '#1B7A4A', // primary action
  cloverDeep: '#145C38', // hover / pressed
  cloverTint: 'rgba(27, 122, 74, 0.16)', // focus ring
  mint: '#E8F5EC', // tinted surfaces
  mintLine: '#CDE5D6', // rings, dashed routes, soft borders
  marigold: '#F4C542', // "you" — used sparingly
  paper: '#FFFFFF',
  paperTint: '#F6FAF7', // auth page background
  line: '#E1E8E4', // input borders, dividers
  danger: '#C9403F',
  dangerTint: 'rgba(201, 64, 63, 0.14)',
} as const;

export const font = {
  regular: 'Sora_400Regular',
  medium: 'Sora_500Medium',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
  extrabold: 'Sora_800ExtraBold',
} as const;

/** Type scale (≈1.25 ratio from a 16px base). */
export const type = {
  display: { fontSize: 56, lineHeight: 60, letterSpacing: -1.6 },
  displaySm: { fontSize: 38, lineHeight: 42, letterSpacing: -1 },
  h1: { fontSize: 34, lineHeight: 40, letterSpacing: -0.8 },
  h2: { fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h3: { fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  lead: { fontSize: 19, lineHeight: 29, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  small: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  tiny: { fontSize: 12.5, lineHeight: 16, letterSpacing: 0 },
} as const;

export const radius = {
  pill: 999,
  input: 16,
  chip: 25,
  panel: 28,
  hero: 36,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 72,
} as const;

/** Soft, single-source shadows. boxShadow is supported on web and on RN's new architecture. */
export const shadow = {
  soft: { boxShadow: '0 4px 14px rgba(15, 42, 32, 0.06)' },
  card: { boxShadow: '0 12px 40px rgba(15, 42, 32, 0.08)' },
  focus: { boxShadow: `0 0 0 4px ${colors.cloverTint}` },
  focusDanger: { boxShadow: `0 0 0 4px ${colors.dangerTint}` },
} as const;

export const layout = {
  maxWidth: 1120,
  breakpoints: { md: 640, lg: 920 },
} as const;

/** Web-only style helpers that RN's type system doesn't know about. */
export const webOnly = (style: Record<string, unknown>) =>
  Platform.OS === 'web' ? (style as object) : {};
