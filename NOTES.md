# Lancemates — take-home notes

Landing page, log in, sign up, and a signed-in state, in the provided Expo / React Native / TypeScript skeleton. No backend; submits are simulated.

## Run it

```
npm install
npm run web          # dev server
npm run build:web    # static site in dist/ (drag onto vercel.com/new or app.netlify.com/drop)
npm run typecheck
```

`vercel.json` is included, so importing the repo into Vercel builds with no settings.

## Design choices

**The idea.** Upwork is the reference for "trustworthy marketplace", but Lancemates' real difference is *proximity*. So the visual system is rings and dots: rings are the radius you're willing to travel, dots are the mates inside it. The logo is a ring with a dot sitting on it, the hero is a neighbourhood board with you in the middle and real-looking tasks a short walk away, and the same rings reappear quietly in the final CTA.

**Palette.** Spruce ink `#0F2A20`, clover green `#1B7A4A` for actions, mint `#E8F5EC` for tinted surfaces, marigold `#F4C542` reserved for "you" and small highlights, white base. Green keeps it in Upwork's neighbourhood without copying its colour.

**Type.** One family, Sora, with weight doing the hierarchy (400/500/600/700/800). Loaded via `expo-font` so it's identical on web and native.

**Shape.** Nothing is square: pill buttons, 16px inputs, 28px panels, 36px hero shapes.

**Motion budget.** One orchestrated moment on load (hero text, then task pills pop in, then a slow radar ping on "you"). Everything else answers the user's own action: press-scale on buttons, password rules ticking off as you type, the success check popping in, a short cross-fade between screens. `prefers-reduced-motion` / the OS setting is respected and entrances render in their final state.

**Copy.** Written from the user's side in plain verbs. Buttons say what happens ("Create account", not "Submit").

## Structure

```
App.tsx                         screen switcher (landing / login / signup / welcome) + font loading + cross-fade
src/theme/tokens.ts             colours, type scale, radii, spacing, shadows
src/utils/validation.ts         email check, password rules, field validators
src/utils/hooks.ts              useBreakpoint, useReducedMotion
src/components/
  Logo, Button, TextField, TextLink, Container, AuthLayout,
  PasswordChecklist, NeighborhoodBoard
src/screens/
  LandingScreen, LoginScreen, SignUpScreen, WelcomeScreen
```

## Forms

- Fields validate when you leave them, then re-validate as you type so the message clears the moment it's fixed.
- Submit validates everything and moves focus to the first problem.
- Sign-up password rules (8+ chars, upper, lower, number, special) are shown *before* you type, so nobody discovers them from an error.
- Enter moves to the next field and submits from the last one.
- Errors are announced via a polite live region; toggles and links have roles and labels.
- On success both forms hand a user object up to `App.tsx` (`onLoginSuccess` / `onSignUpSuccess`) which shows the `WelcomeScreen`. This keeps the form screens forms.

## Responsive

Three tiers from `useWindowDimensions`: phone (<640), tablet (640–920), wide (≥920). The hero stacks and the board scales from a 440px design space; "How it works" turns its dashed route vertical; the auth card gives up its chrome on phones and becomes the page.

## What's mocked / trade-offs

- No navigation library; the given switcher was enough for four screens and it keeps the diff readable. I'd move to expo-router for real URLs.
- Stats and the tasks on the board are illustrative.
- "Forgot password", footer links, Terms/Privacy are dummies.
- Submits wait ~1s to feel like a request, then succeed.
- Fonts: only the Feather icon set is imported to keep the web bundle small.

## Verified

`tsc --noEmit` clean, `expo export --platform web` builds, no console errors in headless Chromium, and every state was screenshotted at 1280px and 390px.
