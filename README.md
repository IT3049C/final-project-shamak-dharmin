# GameHub

## Checklist

- [ ] frequent commits to github.
- [ ] filled out the self-evaluation.

## Self Grading Guide
<!--- Update the following line with your self-grade --->
<!--- Check the Rubric on Canvas for a guideline --->

I should get **(20)** out of 20 on this assignment.

## Self-Reflection

- **How long it took me to finish this?**

- it took us about three weeks planning, implementing and fixing.

- **What do you think of this completion time?**  
- I would say it was pretty reasonable because few of the project who are already done in our assignments so most of the things I reuse them and came up with my idea to implement them. Also copilot help me a lot fixing and deep bugging issue when I was implementing additional games.

- **In hindsight, what would you do differently?**

-  If I wanted to do whole project again, I would use GSAP animation style CSS to pop my game out instead regular CSS.

- **What resources did you use?**
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- Stack Overflow
- Class assignments
- YouTube
  


Single-page Game Hub built with React and Vite. The hub routes between multiple mini‑games, shares a player name across the experience, and ships with Playwright tests and deployment-ready configuration.

## Games Included

Hub lists and routes to the following games:

- **Memory Match** – original game. Flip cards to find matching emoji pairs.
- **Connect Four** – original game. Drop pieces into a 7×6 board and connect 4 in a row.
- **Wordle** – guess a 5-letter word in 6 tries with colored feedback per letter.
- **Typing Speed Test** – type a given sentence as fast and accurately as you can; shows WPM.
- **Rock Paper Scissors** – quick duel vs. computer with running win/loss/draw score.
- **Tic Tac Toe** – classic 3×3 grid with X/O turns and win/draw detection.
- **Prime Rush** – decide quickly if a random number is prime; score points before running out of lives.
- **Pattern Lock** – memorize and reproduce highlighted patterns on a 3×3 lock grid.
- **Quick draw** - kahoot question selection game also able to create private room available on (localhost) only

The hub also shows the player name and team developers on the landing page.

## Features

- **Game Hub SPA** with `react-router-dom` routing between all games.
- **Global player name** captured on the landing page and displayed on all game screens via a shared context and banner.
- **Consistent navigation and styling** with a common header pattern: Back button, game title, optional player tag, and theme toggle.
- **Dark / light theme toggle** backed by a `ThemeContext` and `data-theme` attribute.
- **Automated tests** with Playwright for the hub and several games.

## Getting Started

### Prerequisites

- Node.js (LTS recommended)

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

This serves the built app (used by Playwright tests as well).

## Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end tests.

Install Playwright browsers (once):

```bash
npx playwright install --with-deps chromium
```

Run the full Playwright test suite:

```bash
npm test
```

Current tests (in the `tests` folder):

- `hub.spec.ts` – hub landing page loads, lists games, captures player name, and navigates into/out of games while preserving the name.
- `connect-four.spec.ts` – core Connect Four interactions, board layout, turns, and theme toggle.
- `memory-match.spec.ts` – Memory Match board, card flipping, move counter, and navigation.
- `wordle.spec.ts` – Wordle initial state, guessing flow, and reset behavior.

## Architecture Notes

- **Frontend stack:** React + Vite + `react-router-dom`.
- **Entry point:** `src/main.jsx` mounts the app into `#root`.
- **Routing:** `src/App.jsx` defines routes for the hub and all games.
- **Theming:** `src/context/ThemeContext.jsx` manages dark/light theme and writes `data-theme` on `<html>`.
- **Player name flow:**
  - `src/context/PlayerContext.jsx` stores `playerName` for the whole app.
  - `src/pages/Home.jsx` captures the player name via a labeled input.
  - `src/components/PlayerBanner.jsx` shows the active player on all game routes when a name is set.
- **Games:** Each game lives in `src/games/` with its own JSX + CSS files and uses a shared header pattern.

## Deployment

You can deploy this app to any static host that supports single-page applications, such as Netlify, Vercel, or GitHub Pages.

### General steps (Netlify or Vercel)

1. Push this repo to GitHub.
2. Create a new project in Netlify or Vercel.
3. Set the build command to:

   ```bash
   npm run build
   ```

   and the output directory to:

   ```bash
   dist
   ```

4. Enable "Single Page App"/SPA routing (Netlify: add a redirect rule `/* /index.html 200`; Vercel: the default works for Vite).
5. After the first deploy, paste the **Live URL** back into the "Live URL" section above.

### GitHub Pages (optional)

If you prefer GitHub Pages, you will need to:

- Configure the Vite `base` path to match your repository name.
- Deploy the `dist` folder to GitHub Pages (e.g., via `gh-pages` branch or GitHub Actions).

## Short Reflection (3–5 bullets)

You can adjust the wording, but here are example bullets that match this project:

- Learned how to organize a React SPA with a hub page, shared layout, and multiple self-contained games.
- Got more comfortable using React Router for navigation and keeping state (like the player name) in a global context.
- Realized the importance of writing Playwright tests early to catch broken routing or missing selectors before deployment.
- If I had more time, I would focus on adding a polished multiplayer mode using our class game room API and improving mobile responsiveness.
- Peer feedback helped prioritize a clean landing page, clearer game descriptions, and a consistent back button on all screens.

## Team Members
- Dharmin Patel
- Shamak Patel
