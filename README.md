# Vartalab — Student-focused English Learning Platform

A **front-end prototype** of an English communication / IELTS-prep web app.
It was originally delivered as a **single monolithic `index.html`** (~2,000 lines,
CSS + HTML + JS all inline). It has now been **refactored into separate files**
(see structure below) with zero changes to behaviour.

> ⚠️ This is a **client-side demo/prototype only**. Passwords are "hashed" with a
> tiny non-cryptographic function just to demonstrate the flow, and all data lives
> in the browser. A production build needs a real backend, salted slow hashing
> (bcrypt/argon2), a database, and server-side auth.

---

## 1. Technology stack — what is used

| Layer | Technology | Notes |
|---|---|---|
| Markup | **HTML5** | Semantic header/main/footer, single `#app` mount point |
| Styling | **Pure CSS3** (custom design system) | CSS variables, flexbox, grid, `clamp()` fluid type, media queries, gradients, animations. **No CSS framework** (no Bootstrap/Tailwind) |
| Logic | **Vanilla JavaScript (ES2020+)** | `"use strict"`, template literals, arrow functions, `const/let`, destructuring, optional chaining (`??`). **No framework** (no React/Vue/Angular), **no build step**, **no dependencies**, **no npm packages** |
| Routing | **Custom hash router** | `go(view)` + `hashchange` listener, views keyed by name (`home`, `learn`, `arena`…) |
| Rendering | **DOM string templates** | Views are functions returning HTML strings injected into `innerHTML` |
| State / DB | **`localStorage`** (+ in-memory fallback) | All users, attempts, contests etc. persist under the `vartha_db` / `vartha_session` keys |
| Icons | **Inline SVG** | Hand-written SVG strings (`js/17-icons-init.js`), no icon library |
| Fonts | System font stack | Inter → SF Pro → Segoe UI → system-ui (no webfont download) |
| Hosting artifact | Cloudflare bot-challenge snippet | The original file ended with an injected Cloudflare `cdn-cgi` script; that was hosting-injected and is **not** part of the app, so it was dropped |

**In short: 100% vanilla HTML/CSS/JS — no libraries, no frameworks, no build tools.**

---

## 2. Project structure (after refactor)

```
Varta-Lab/
├── index.html              ← markup shell only: <head>, navbar, #app, footer, modal/toast, <script> tags
├── css/
│   └── styles.css          ← the full design system & all component styles (~330 lines)
└── js/
    ├── 01-utils.js         ← DOM helpers ($, $$), esc() HTML-escaper, uid(), demo hash()
    ├── 02-store.js         ← storage layer: localStorage wrapper with in-memory fallback
    ├── 03-data.js          ← SEED data: skills, lessons, questions, users, contests, communities, events, leaderboard, achievements
    ├── 04-state.js         ← app state: DB, SESSION, state, me(), user helpers
    ├── 05-router.js        ← go() navigation, auth guards, admin guard
    ├── 06-render.js        ← render() dispatcher that mounts the active view
    ├── 07-nav-footer.js    ← navbar, mobile burger menu, footer, toast() notifications
    ├── 08-views-public.js  ← Home (hero + pillars), How It Works, About + contact form
    ├── 09-auth.js          ← signup / login / password-reset modals, logout
    ├── 10-onboarding.js    ← goal & level selection, placement diagnostic quiz
    ├── 11-views-learn.js   ← Learn dashboard (skills, weak areas, recommendations) + lesson player + quizzes
    ├── 12-views-practice.js← Speaking/Writing practice with simulated AI feedback + timer
    ├── 13-views-arena.js   ← IELTS Arena: contest list, timed contest player, results, rating/rank
    ├── 14-views-profile.js ← Leaderboard (global/friends), profile page, visibility toggle
    ├── 15-views-social.js  ← CO-LAB communities (join/feed), ACT-LAB events (register), achievements
    ├── 16-views-admin.js   ← Admin panel: user management/search, lesson/contest/event creators, audit log
    └── 17-icons-init.js    ← inline SVG icon set + DOMContentLoaded bootstrap & hash routing
```

### Why numbered files?
The scripts are **classic (non-module) scripts** that intentionally share one global
scope (the HTML uses inline `onclick="go(...)"` handlers, which need global functions).
Loading them in numeric order guarantees that data/state/utils exist before the views
and the bootstrap code run. (They could later be converted to ES modules, but that
would require replacing the inline `onclick` handlers with `addEventListener`.)

---

## 3. How it works

1. On load, `17-icons-init.js` reads `location.hash`, calls `go(view)`, and `render()`
   mounts the matching view's HTML into `<main id="app">`.
2. Every view is a function (`viewHome()`, `viewLearn()`, `viewArena()` …) returning an
   HTML string. Buttons call global functions like `go('learn')`, `doLogin()`,
   `startLesson(id)`, `finishContest()`.
3. All data is seeded from `js/03-data.js` on first run into `localStorage`, then read
   and mutated in memory via the `DB` object and saved with `save()`.
4. Authenticated views (`learn`, `practice`, `arena`, `profile`, `admin`, …) are guarded
   in `js/05-router.js`; unauthenticated users get the login modal. `admin` is
   additionally restricted to users with `role:"admin"`.

### Demo accounts (seeded)
- **Admin:** `admin@vartalab.in` / `admin123`
- **Student:** e.g. `ananya@example.com` / `pass123` (and rahul/priya/dev/ishita/meera `@example.com`, same password)

---

## 4. Feature overview

- **Public pages:** landing hero, "How it works", About + contact form.
- **Auth:** sign up, log in, password reset (simulated), logout, role-based access.
- **Onboarding:** goal picker (IELTS/Interview/Speaking…), CEFR level, placement diagnostic quiz.
- **Learn:** grammar-first skill grid (tenses, articles, prepositions, conditionals…),
  lessons with explanations, examples and multiple-choice questions, weak-area detection,
  recommendations, progress tracking.
- **Practice:** speaking & writing prompts with a timer and *simulated* AI-style feedback
  (clearly labelled as assistance, not a real IELTS score).
- **IELTS Arena:** weekly timed contests, countdown timer, question navigation, scoring,
  rating updates and percentile/rank results.
- **Leaderboard:** global and friends tabs with seeded ratings.
- **Profile:** user stats, achievements/badges, public/private visibility.
- **CO-LAB:** communities you can join, with sessions and a post feed.
- **ACT-LAB:** events (debates, movie discussions, mock interviews…) with registration.
- **Admin panel:** search/manage users, create lessons/contests/events, audit log.

---

## 5. Run it

No build step. Serve the folder statically (needed so the separate `css/`/`js/` files load):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Or open `index.html` directly in a browser — it also works over `file://`.)

---

## 6. Verification

The refactor was verified with a headless-DOM (jsdom) smoke test: all 17 JS files pass
`syntax check`, every asset loads with HTTP 200, and **15/15 functional checks pass with
0 console errors** — login/logout, auth guard, learn dashboard, lesson player, practice,
arena contest list, leaderboard, profile, CO-LAB join, ACT-LAB registration and the admin
panel all render and behave exactly as in the original single file.
