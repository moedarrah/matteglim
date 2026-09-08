# Verification

- Yarn dependency installation completed and `yarn.lock` was generated.
- `yarn build`: passed, including TypeScript compilation.
- `yarn lint`: passed.
- `yarn test`: 32 tests passed.

Automated component tests cover Home → Start → level selection, all five direct game routes, invalid-level redirects, correct answers, one-point scoring, duplicate-submission protection, automatic advancement and focus, unchanged questions after mistakes, heart removal, game over, retry/reset, choosing another level, numeric-only input, Enter submission, and timer cleanup when navigating away.

Question-generation tests sample 1,500 questions per level and check operand ranges, allowed operators, correct results, nonnegative subtraction, and multiplication limits. Additional tests check immediate-repeat rerolling and bounded retries.

HTTP checks against Vite returned 200 for `/`, `/levels`, `/game/1`, `/game/5`, and `/game/invalid`. Invalid IDs are redirected client-side, as covered by the component test.

Responsive CSS includes phone and tablet breakpoints, large controls, locally bundled fonts, and reduced-motion support. Browser visual testing and real tablet keyboard behavior were **not verified** because the browser runtime reported no connected browsers. Those checks remain manual.

Sound tests cover quiet note scheduling, stopping active audio, cancelling suspended playback, unsupported/blocked audio, saved toggle preferences, unavailable storage, navigation cues, correct/wrong answer cues, game-over and restart cues, and duplicate-submission protection. Actual listening and mobile audio playback remain unverified without a connected browser.

GitHub Pages setup: `yarn build:pages` and lint passed. Built asset URLs use `/matteglim/` and resolve to emitted files. Three routing tests cover direct hash game links, invalid game links, skip-link focus, and standard local URLs. The GitHub Actions deployment has not yet been run; Pages must be enabled and the workflow pushed first.
