# Lancemates — take-home (Expo / React Native / TypeScript)

Landing page + log in + sign up + signed-in state for a local gig marketplace. Web is the primary target (`npm run web`), but everything is written with React Native primitives so it also runs in Expo Go. Read `TASK.md` for the brief and `NOTES.md` for the design rationale before changing anything visual.

## Commands

```
npm install
npm run web          # dev server (Metro web)
npm run typecheck    # tsc --noEmit — run before every commit
npm run build:web    # static site in dist/ (drag onto vercel.com/new or app.netlify.com/drop)
```

Expo CLI cannot reach api.expo.dev in some sandboxes; if `npx expo install` fails, pin versions from `node_modules/expo/bundledNativeModules.json` and use plain `npm install`.

## Layout

```
App.tsx                      screen switcher (landing/login/signup/welcome), font loading, cross-fade
src/theme/tokens.ts          ALL colours, type scale, radii, shadows — never hardcode hex or font names in screens
src/utils/validation.ts      email check, password rules, per-field validators (single source of truth)
src/utils/hooks.ts           useBreakpoint (phone <640, tablet <920, wide), useReducedMotion
src/components/              Logo, Button, TextField, TextLink, Container, AuthLayout, PasswordChecklist, NeighborhoodBoard
src/screens/                 LandingScreen, LoginScreen, SignUpScreen, WelcomeScreen
```

## Conventions that must survive edits

- **Design system:** spruce ink `colors.ink`, clover green for actions, mint surfaces, marigold ONLY for "you"/small highlights. One typeface (Sora) — hierarchy comes from weight (`font.regular … font.extrabold`), not from new faces. Nothing square: pills for buttons, `radius.input` 16, `radius.panel` 28, `radius.hero` 36.
- **Motion budget:** one orchestrated load moment (hero text → board pills pop in → slow radar ping on "you"). Everything else must answer a user action (press scale, rules ticking, success check, screen cross-fade). Do not add scroll-triggered or per-card hover animations. Every entrance must respect `useReducedMotion()`.
- **Forms:** validate on blur, re-validate on change once touched, validate everything on submit and focus the first problem. Error copy lives in `validation.ts`; sentence case, says what to do. Submits are simulated with `wait()` and then call `onLoginSuccess` / `onSignUpSuccess` up to `App.tsx` — screens stay forms, `WelcomeScreen` owns the success state.
- **One `TextField` for every input.** Focus ring, error ring, hint, and password toggle live there; don't build ad-hoc inputs in screens.
- **Copy:** plain verbs, sentence case, no "Submit", no ALL-CAPS labels, no middle-dot separators. Buttons say what happens ("Create account").
- **Accessibility:** roles/labels on every pressable, `accessibilityLiveRegion` on errors, keyboard Enter moves to next field / submits.

## Web vs native gotchas

- `useNativeDriver` must be `Platform.OS !== 'web'` (see the `useNative` const in files that animate).
- Import icons as `import Feather from '@expo/vector-icons/Feather'` (the barrel import pulls ~4 MB of unused fonts into the web bundle).
- Shadows use the `boxShadow` string style (works on web + RN new architecture); don't reintroduce `shadow*`/`elevation` props.
- `webOnly({ outlineStyle: 'none' })` removes the browser input outline; the custom border/ring is the visible focus state.
- The landing nav is sticky via `stickyHeaderIndices={[0]}` — it must stay the first child of the ScrollView.
- `NeighborhoodBoard` is designed in a 440×440 space and scaled with `transformOrigin: 'top left'`; place pills by centre coordinates in that space.

## Verification before calling something done

1. `npm run typecheck` is clean.
2. `npm run build:web` succeeds.
3. Check both 1280px and 390px widths; the hero stacks, stats become inline rows, "How it works" route goes vertical, auth card loses its chrome on phones.
4. Try the forms with bad input; every field must show an inline message and submit must focus the first error.

## Mocked / out of scope

No backend, no navigation library (switcher in `App.tsx` is intentional; move to expo-router when real routes are needed), stats and board tasks are illustrative, footer/Terms/Forgot-password links are dummies.
