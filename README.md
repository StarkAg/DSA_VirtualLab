<h1 align="center">🧪 DSA Virtual Lab</h1>

<p align="center">
  An interactive <b>Data Structures &amp; Algorithms</b> learning platform — theory,
  animated visualizations, a real in-browser code editor, and quizzes.
</p>

<p align="center">
  <a href="https://dsa-virtual-lab.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-dsa--virtual--lab.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white"></a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="CodeMirror" src="https://img.shields.io/badge/CodeMirror-6-D30707?logo=codemirror&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-22c55e">
</p>

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="DSA Virtual Lab dashboard" width="100%">
</p>

A full-fledged virtual lab modeled on the SRMIST *eLab* experience. Each experiment
combines **theory**, an **interactive visualization**, a **real code editor** (compile &
run against test cases), and a **quiz**. Student accounts, progress and quiz scores are
persisted in a **Convex** backend, and an **admin panel** shows a live student leaderboard.
Built with **React + Vite + TailwindCSS**, using the GradeX typographic design language
(Space Grotesk / Inter / JetBrains Mono) recoloured to an academic light palette.

🔗 **Live:** https://dsa-virtual-lab.vercel.app &nbsp;·&nbsp; 🔐 **Admin:** `/admin`

## Screenshots

| Experiment — theory & live visualizer | Practice — real C/C++/Java/Python grading |
|:--:|:--:|
| ![Theory and visualization](docs/screenshots/experiment-theory.png) | ![Code editor with passing tests](docs/screenshots/practice.png) |
| **Quiz with instant scoring** | **Admin panel — students & leaderboard** |
| ![Quiz](docs/screenshots/quiz.png) | ![Admin leaderboard](docs/screenshots/admin.png) |

## The 5 experiments
1. **Stack (LIFO)** — push / pop / peek; balanced parentheses, reverse using a stack
2. **Queue (FIFO)** — enqueue / dequeue; FIFO ordering, rotate the queue
3. **Singly Linked List** — build & traverse, delete a value
4. **Sorting** — Bubble Sort & Quick Sort (animated bars, step/play/speed)
5. **Searching** — Linear & Binary Search (animated lo/hi/mid)

Each experiment page has four tabs: **Aim & Theory · Challenge · Practice · Quiz**.

## Getting started
```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Real code execution (free, no setup)
The editor compiles & runs **C / C++ / Java / Python** for real — no API key, no server.

The browser posts to a same-origin proxy (`/api/execute`) which runs submissions on the
free public **Wandbox** compiler API. This works out of the box both on Vercel and in
`npm run dev` (a small Vite middleware mirrors the serverless function locally). The
`Evaluate` button grades your code against the test cases.

- Set `VITE_EXEC_MODE=mock` to turn execution off (editor becomes reference-only).
- See **DEPLOY.md** to swap the backend to your **self-hosted Judge0** for unlimited,
  private execution — just set `JUDGE0_URL` as a server env var; no code changes.

## Backend (Convex)
Students sign in with name + email (no password) — this upserts a **Convex** user record.
Solved challenges, quiz scores and submission logs are stored in Convex and drive the
dashboard, "Programs Solved" count and rank in real time. Experiment **content**
(problems, test cases, quizzes) stays in code (`src/data/experiments.js`).

Convex functions: `users.ensureUser`, `progress.recordSolve` / `setQuizBest` /
`forUser`, `admin.students` (aggregates). See **DEPLOY.md** for provisioning.

## Admin panel — `/admin`
Passcode-gated analytics dashboard: total students, total solves, active-today, and a
**student leaderboard** (solved counts, quiz averages, last activity) read live from
Convex. The passcode is a Convex env var (`ADMIN_PASSCODE`).

## Deploy
Frontend on **Vercel** (SPA routing preconfigured), backend on **Convex**. Free code
execution via **Wandbox**. Full steps in **DEPLOY.md**.

## Project layout
```
convex/         Convex backend
  schema.ts     users, solves, quizScores, submissions
  users.ts · progress.ts · admin.ts · seed.ts
api/            execute.js + _exec.js  (Wandbox/Judge0 proxy)
src/
  pages/        Login, Dashboard, Experiment, Admin
  components/
    layout/     TopBar, SideBar, SectionHeader, AppShell  (eLab chrome)
    dashboard/  StatCard, ExperimentCard, RankWidget
    experiment/ ChallengeInfo, TestCasePanel, PracticePanel, ResultPanel, TheoryPanel
    editor/     CodeEditor (CodeMirror 6)
    visualizers/ Stack, Queue, LinkedList, Sort, Search
    quiz/       Quiz
  lib/          identity.js (profile) · stats.js · judge0.js (execution client)
  data/         experiments.js  (single source of truth for all content)
```
