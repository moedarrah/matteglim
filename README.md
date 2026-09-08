# Matteglim

A frontend-only Swedish math game built with React, Vite, TypeScript, Ant Design and React Router. No backend, database, account, or saved game progress. Only the sound preference is saved on this device. Fonts are bundled locally.

## Run

Requires Node.js 22.18+ and Yarn.

```sh
cd matteglim
yarn
yarn dev
```

```sh
yarn build
yarn lint
yarn test
yarn preview
```

## Structure

- `src/config/levels.ts`: ranges, operators, multiplication limits and visual themes. Ranges apply to each operand; addition results can be larger. Subtraction results are always nonnegative.
- `src/config/translations.ts`: all Swedish interface text, including level names. Add a matching translation object and select it here to introduce another language.
- `src/utils/generateQuestion.ts`: randomized questions with bounded retries to avoid immediate repeats.
- `src/pages/MathGame.tsx`: session state, input validation, transition locking and timer cleanup.
- `src/components`: hearts, score, mascot and game-over presentation.

Routes: `/`, `/levels`, `/game/:levelId`. Invalid level IDs redirect to `/levels`. Sessions restart on reload or when choosing a new level. Each correct answer earns one point and advances after 1.1 seconds; a wrong answer removes one heart and keeps the question.

## Static hosting

Deploy the `dist/` directory and configure the host to rewrite unknown paths to `index.html` for BrowserRouter deep links. Vite's development and preview servers already provide this fallback. `public/_redirects` provides it for hosts supporting that convention.

## Accessibility

Keyboard and Enter submission, numeric tablet keyboard, visible focus, live feedback, labeled hearts and input, large touch targets, and reduced-motion support.

## Sounds

Short, quiet Web Audio tones accompany starting, level selection, correct answers, mistakes, and game over. The Swedish header sound toggle remembers its setting in localStorage. Audio starts only after interaction; unsupported or blocked audio does not affect gameplay. There are no audio downloads or background music.
