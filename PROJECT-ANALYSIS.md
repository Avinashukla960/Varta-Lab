# Varta-Lab — Complete Project Analysis

> Written for someone who knows **HTML and basic JavaScript** and nothing else.
> Every technology, technique, and file in this project is explained from scratch.

---

## 1. What is this project? (The one-paragraph version)

**Vartalab** is a front-end prototype (a working demo, not a real product) of an
**English-learning / IELTS-preparation web app** for students. It has a landing page,
login/signup, a learning dashboard with grammar lessons and quizzes, a speaking/writing
practice section with *simulated* AI feedback, weekly timed "IELTS Arena" contests with
ratings and leaderboards, communities, events, user profiles with achievements, and an
admin panel.

The single most important thing to understand:

> **The entire app is just 3 plain files types — HTML, CSS, and JavaScript.
> There is NO framework (no React, Vue, or Angular), NO build tool (no Webpack/Vite),
> NO package manager (no npm), NO server, and NO real database.
> Everything runs in the browser, and all "data" is stored in the browser's
> `localStorage`.**

If you can open a `.html` file in a browser, you can run this whole app.

---

## 2. The big idea: a "Single Page Application" (SPA) made by hand

Normally, websites have many HTML pages: `home.html`, `about.html`, `contact.html`, and
clicking links makes the browser load a whole new file each time.

This project uses the **SPA (Single Page Application)** approach instead:

- There is only **one HTML page**: `index.html`.
- That page contains an **empty container**: `<main id="app"></main>`.
- JavaScript **writes different HTML into that container** depending on which "page"
  the user is on. These fake pages are called **views** (home, learn, arena, profile…).
- Because the browser never actually reloads, the app feels fast and instant, like a
  native app.

Frameworks like React exist mainly to do this job for you. This project proves you can
do it yourself with plain JavaScript — which makes it an excellent learning artifact.

### How navigation works (the "router")

In a normal site, the URL is `example.com/about.html`. Here, the app uses **hash URLs**
— the `#` part of a URL ( historically used to jump to a section on the same page):

```
https://yoursite.com/#/learn     → shows the "learn" view
https://yoursite.com/#/arena     → shows the "arena" view
```

Why hashes? Because changing the part **after** `#` does **not** reload the page — it
just fires a JavaScript event called `hashchange`. That's the trick that makes a
one-file app behave like it has many pages. And it works even when the folder is opened
directly from disk (`file://`), with no web server at all.

The flow when you click "Learn" in the navbar:

```
click → onclick="go('learn')"      (an inline JS handler on the link)
     → go() checks: is 'learn' login-only? is the user logged in?
     → state.view = "learn"        (remember the current page in a variable)
     → render()                    (rebuild the screen)
     → $("#app").innerHTML = viewLearn()   (a function that RETURNS the HTML string)
```

---

## 3. File map — what every file is for

```
Varta-Lab/
├── index.html              ← The ONLY HTML file: page skeleton + loads everything
├── css/
│   └── styles.css          ← All styling (~331 lines, a hand-made "design system")
└── js/                     ← 17 JavaScript files, loaded IN NUMBER ORDER
    ├── 01-utils.js         ← Tiny helpers: $, $$, esc(), uid(), hash()
    ├── 02-store.js         ← Saving/loading data (localStorage + fallback)
    ├── 03-data.js          ← All the starting "database" content (seed data)
    ├── 04-state.js         ← The app's memory: DB, SESSION, state, me()
    ├── 05-router.js        ← go() navigation + login/admin guards
    ├── 06-render.js        ← render() — decides which view to draw
    ├── 07-nav-footer.js    ← Navbar, mobile menu, footer, toast pop-ups
    ├── 08-views-public.js  ← Views: Home, How It Works, About/Contact
    ├── 09-auth.js          ← Signup / login / password-reset / logout
    ├── 10-onboarding.js    ← Goal + level picker, placement diagnostic quiz
    ├── 11-views-learn.js   ← Learn dashboard + lesson player + quizzes
    ├── 12-views-practice.js← Speaking/writing practice + fake AI feedback
    ├── 13-views-arena.js   ← IELTS Arena contests, timer, scoring, results
    ├── 14-views-profile.js ← Leaderboard + profile page
    ├── 15-views-social.js  ← CO-LAB communities, ACT-LAB events, achievements
    ├── 16-views-admin.js   ← Admin panel: users, content creation, audit log
    └── 17-icons-init.js    ← SVG icon set + app startup (boot) code
```

### Why are the JS files numbered?

`index.html` loads them with plain `<script src="...">` tags, in order:

```html
<script src="js/01-utils.js"></script>
<script src="js/02-store.js"></script>
...etc...
<script src="js/17-icons-init.js"></script>
```

These are **classic scripts** (not modern "ES modules"), which means they **all share
one global scope** — like pasting all 17 files into one giant file. Function `go()`
defined in file 05 can be called from file 17, and even from `onclick=""` attributes
in HTML.

The numbering guarantees that **helpers exist before they're used**: the seed data
(file 03) calls `hash()` which is defined in file 01, so 01 must load first. File 17
runs last because it *starts* the app, and everything it needs is ready by then.

(Modern projects use `import`/`export` modules instead, but those don't work with
inline `onclick=` handlers without extra wiring, so this project sticks to classic
scripts.)

---

## 4. The HTML layer (`index.html`)

The HTML file is deliberately tiny (59 lines) because **almost all HTML in this app is
generated by JavaScript**. The file only contains the permanent skeleton:

| Element | Purpose |
|---|---|
| `<meta charset="UTF-8">` | Allows proper characters (₹, é, emoji…) |
| `<meta name="viewport" ...>` | Makes the page mobile-friendly (scales to the screen width) — essential for responsive design |
| `<meta name="description" ...>` | Text Google shows in search results (SEO) |
| `<link rel="stylesheet" href="css/styles.css">` | Attaches the stylesheet |
| `<header class="nav">` | The sticky top navbar: logo, links (`#topnav`), login buttons (`#navcta`), mobile hamburger (`#burger`) |
| `<main id="app">` | **The empty mount point.** Every "page" is injected here |
| `<footer id="footer">` | Empty; JS fills it |
| `<div class="modal-bg" id="modal">` | A popup dialog (login/signup forms) hidden by default, shown by adding a CSS class |
| `<div id="toasts">` | Corner where small notification pop-ups appear |

Things worth learning from this file:

- **Semantic tags**: `<header>`, `<main>`, `<footer>`, `<nav>` (used in the JS-generated
  HTML too, plus `<section>`, `<aside>`) — they describe meaning, not looks, and help
  screen readers and search engines.
- **Inline event handlers**: `onclick="go('home');return false;"` — clicking runs the
  global JS function `go()`. The `return false` stops the link from navigating away.
- **The modal pattern**: the background `<div>` has
  `onclick="if(event.target===this)closeModal()"` — a classic trick to close a popup
  when the user clicks the dark backdrop but *not* when they click inside the dialog.

---

## 5. The CSS layer (`css/styles.css`) — every technique explained

One stylesheet of ~331 lines contains a complete hand-made **design system**
(a consistent set of colors, buttons, cards, and text styles). **No CSS framework**
(Bootstrap/Tailwind) and **no preprocessor** (SASS) is used.

### 5.1 CSS custom properties (CSS variables)

At the top, inside `:root` (which means "the whole document"):

```css
:root{
  --brand:#5b5bd6;      /* main purple */
  --accent:#ff6a3d;     /* orange */
  --bg:#f4f5fb;
  --radius:18px;
  --shadow:0 14px 34px -16px rgba(59,48,119,.22);
  --font:"Inter","SF Pro Display","Segoe UI",system-ui,...;
}
```

Then used everywhere: `color:var(--brand)`. Benefits: change one line → the whole app
re-colors; the palette stays consistent. This is how professional design systems work.

### 5.2 Layout: Flexbox and CSS Grid (the two modern layout systems)

- **Flexbox** (`display:flex`) arranges items in **one direction** — a row or a column.
  Used for the navbar (logo left, links right), and `.aicb` ("align items center
  between" — the project's shorthand for a row with space between, used for hundreds
  of list rows: `display:flex;align-items:center;justify-content:space-between`).
- **CSS Grid** (`display:grid`) arranges items in **two dimensions** — rows *and*
  columns. Used for card layouts:

  ```css
  .grid{display:grid;gap:22px}
  .g2{grid-template-columns:repeat(2,1fr)}   /* 2 equal columns */
  .g3{grid-template-columns:repeat(3,1fr)}   /* 3 equal columns */
  ```

  `1fr` means "one fraction of the free space" — columns share the width equally.
  Views override this inline (e.g. `style="grid-template-columns:1.4fr 1fr"`) to make
  a wide column and a narrow one.

- The app-shell layout (`.app` = sidebar + content) is also a grid: a fixed-width
  `<aside class="side">` next to a flexible `.main`.

### 5.3 Responsive design (media queries)

```css
@media(max-width:920px){ .g3{grid-template-columns:repeat(2,1fr)} }  /* tablet: 3 cols → 2 */
@media(max-width:640px){ .g2,.g3,.g4{grid-template-columns:1fr} }    /* phone: everything → 1 col */
```

A **media query** applies CSS only when a condition (here: screen narrower than 920px
or 640px) is true. Same technique hides the desktop navbar and shows the hamburger
menu on phones, and collapses the sidebar. This is why the app works on mobile.

### 5.4 Fluid typography with `clamp()`

```css
h1{font-size:clamp(2.1rem,5.4vw,3.7rem)}
```

`clamp(min, preferred, max)` = "at least 2.1rem, ideally 5.4% of the viewport width,
never more than 3.7rem". Headings therefore scale smoothly with the screen — no media
queries needed for text.

### 5.5 Visual effects

- **Gradients**: `linear-gradient(120deg,var(--brand),var(--brand-2))` on buttons,
  logos and progress bars; two large `radial-gradient`s in the body background give a
  soft purple/orange glow in the corners.
- **Gradient text** (a modern trick):

  ```css
  .grad-text{background:linear-gradient(110deg,...);
             -webkit-background-clip:text; color:transparent;}
  ```

  The text is painted transparent so you see the gradient behind it *clipped* to the
  letter shapes.
- **Shadows** in 3 sizes (`--shadow-sm`, `--shadow`, `--shadow-lg`) create depth.
- **Rounded corners**: `border-radius:18px` on cards, `999px` on buttons (a huge value
  = full pill shape).
- **Transitions**: `transition:transform .15s ease, box-shadow .22s` — buttons gently
  lift (`transform:translateY(-2px)`) and grow a bigger shadow on hover.
- **Keyframe animations**:

  ```css
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  ```

  makes the hero-page decorative blobs bob up and down; `slideup` animates toasts and
  modals appearing.
- **Glassmorphism navbar**:

  ```css
  .nav{position:sticky;top:0;backdrop-filter:saturate(180%) blur(16px);
       background:rgba(255,255,255,.72)}
  ```

  `position:sticky` keeps it pinned to the top when scrolling;
  `backdrop-filter:blur()` frosts whatever scrolls underneath — the "frosted glass"
  look.
- **`::selection`** styles the highlight color when the user selects text.
- **Utility classes** (like a mini Tailwind): `.mt-16` (margin-top:16px), `.mb-24`,
  `.center`, `.small`, `.muted`, `.wrap` (centered max-width container) — small,
  composable classes so HTML stays tidy.

### 5.6 The fonts

No font file is downloaded. It uses a **system font stack**: `"Inter","SF Pro
Display","Segoe UI",system-ui,...` — the browser picks the first one installed on the
user's device. Zero network requests, zero loading delay.

---

## 6. The JavaScript layer — every concept used, explained

~1,700 lines of plain, modern JavaScript ("ES2020" style). No libraries at all — not
even jQuery.

### 6.1 Modern JS syntax you'll meet on every line

| Syntax | What it means | Example from the code |
|---|---|---|
| `const` / `let` | Declare variables (`const` can't be reassigned). `var` is never used | `const $ = (s,el=document)=>...` |
| **Arrow functions** `=>` | Shorter function syntax | `const uid = () => Math.random().toString(36)...` |
| **Template literals** | Strings with backticks `` ` `` that can span lines and embed values with `${}` | `` `<h2>${esc(u.name)}</h2>` `` — this is how all the HTML gets built |
| **Default parameters** | Fallback values for missing arguments | `(s,el=document)=>` — if no `el` given, use `document` |
| **Destructuring** | Pull items out of arrays/objects in one line | `const [k,lbl] = ["home","Home"]` |
| **Spread `...`** | Copy/merge arrays and objects | `DB = {...SEED}`, `answers:{...state.cAnswers}` |
| **Optional chaining / nullish** `??` | Safe fallback for missing values | `String(s??'')` — use `''` if `s` is null/undefined |
| **Ternary `? :`** | One-line if/else that *returns* a value | `${ok?'✓ passed':'retry'}` |
| **`"use strict"`** | Old-style switch that turns on stricter error checking | first line of `01-utils.js` |

### 6.2 Array methods (functional style — the workhorse of this codebase)

Instead of `for` loops, the code chains built-in array methods:

| Method | Does what | Used for |
|---|---|---|
| `.map(fn)` | Transform every item → **new array** (same length) | Turning data arrays into HTML rows: `users.map(u => \`<div>...\`)` |
| `.filter(fn)` | Keep only matching items | `attempts.filter(a=>a.userId===SESSION)` — "my attempts only" |
| `.find(fn)` | Get the **first** matching item | `DB.users.find(u=>u.id===SESSION)` — "the logged-in user" |
| `.some(fn)` | true if **at least one** matches | "did I already take the diagnostic?" |
| `.sort(fn)` | Reorder (comparator returns negative/positive) | sorting leaderboard by points |
| `.slice(-5).reverse()` | Last 5 items, newest first | "recent activity" lists |
| `.forEach(fn)` | Run something for each item | aggregating skill accuracy |
| `.includes(x)` | Is the value in the array? | checking joined communities |

Also used: `Set` — a collection of **unique** values — holds the list of login-only
view names (`AUTH_VIEWS`), with a fast `.has()` check.

### 6.3 DOM manipulation (how JS builds the page)

- `document.querySelector(sel)` — find the first element matching a CSS selector.
  The project defines a shorthand: `const $ = s => document.querySelector(s)`, so
  code reads `$("#app")` like jQuery without jQuery.
- `$$` — shorthand for `querySelectorAll` turned into a real array (so `.map` works).
- **`element.innerHTML = htmlString`** — replace an element's contents with new HTML.
  This is the app's entire rendering strategy: build a big HTML string, blast it in.
- `classList.add/remove/toggle` — switch CSS classes on/off (e.g. `modal.classList.add("open")`
  shows the popup; `correct`/`wrong`/`selected` classes recolor quiz answers).
- `document.createElement` + `appendChild` — used only for toasts (pop-up messages),
  which must appear *without* re-rendering the page.
- `addEventListener("click"/"hashchange"/"DOMContentLoaded", fn)` — run code on events.
- `window.dispatchEvent(new Event("appRendered"))` — the app fires its **own custom
  event** after each render, a hook other code could listen to.
- **Inline `onclick` attributes in generated HTML** — the app's main interaction
  pattern: every button is born with its handler baked in, e.g.
  `<button onclick="startLesson('l-tenses')">`. Because the page is fully re-rendered
  after each action, this is simple and works well.

### 6.4 The fake database: `localStorage`

Real apps store data on a server. This one stores it **inside the user's browser**:

- `localStorage` is a small built-in browser database that keeps strings **forever**
  (until the user clears it) — surviving page reloads and computer restarts.
- It only stores strings, so everything is converted with
  `JSON.stringify(object)` when saving and `JSON.parse(string)` when loading. JSON is
  the text format that looks like JS object literals.
- Two keys are used: `vartha_db` (all app data) and `vartha_session` (who is logged in).

`js/02-store.js` wraps it in a tiny safe wrapper: if `localStorage` is blocked (some
sandboxed previews do that), it silently falls back to a plain in-memory object
`_mem` — the app then works but forgets everything on reload.

### 6.5 State management

The app's memory lives in a few globals (file `04-state.js`):

- **`DB`** — the whole "database" object (users, lessons, contests, attempts…).
  On first visit it's cloned from `SEED` and saved; afterwards it's loaded from
  `localStorage`. Every change calls `save()` to persist.
- **`SESSION`** — the id of the logged-in user (or null). This is the "login token".
- **`state`** — temporary UI memory: current view, open lesson/contest, active tab,
  quiz progress. It is *not* persisted — refreshing resets you to the home view
  (but you stay logged in).
- Helpers: `me()` returns the logged-in user object; `getUser(id)`,
  `myAttempts()`, `dbArr(key)` (get-or-create a list inside DB).

### 6.6 Authentication (simulated)

File `09-auth.js` implements a **demo login system**:

1. **Passwords are "hashed"** — never stored as plain text. The `hash()` function
   (file 01) scrambles text with a loop of bit operations and returns something like
   `v1$3f9a1c`. ⚠️ It's a toy (a "djb2-style" hash): fast and easily reversed. Real
   apps use bcrypt/argon2 **on a server**. Here it's only for demonstrating the flow.
2. **Signup** validates the form in JS: name length, email format via a **regular
   expression** (`/[^@ ]+@[^@ ]+[.][^@ ]+/`), minimum 8-char password, terms
   checkbox, and no duplicate email. Then it creates a user object with a random
   avatar color and starting rating 1000.
3. **Login** finds the user by email *or* phone and compares `hash(input) === stored`.
4. **Session** = writing the user's id into `vartha_session`; **logout** = deleting it.
5. **Route guards** (file 05): `go()` checks `AUTH_VIEWS` — if you're not logged in,
   the requested view is blocked and the login modal pops up. The `admin` view
   additionally requires `role:"admin"` — **role-based access control**, in miniature.

### 6.7 Timers and dates

- `setInterval(fn, 1000)` / `clearInterval` — the contest countdown ticks every second
  (file 13); when it hits 0, the contest auto-submits.
- `setTimeout` — toasts fade out after ~2.6 s and remove themselves at 2.9 s.
- `Date.now()` — milliseconds since 1970 ("timestamp"), used to date attempts and to
  compute contest countdowns with arithmetic on `864e5` (a day in ms), `36e5` (an
  hour), `6e4` (a minute). `Math.floor` turns ms back into days/hours/minutes.

### 6.8 HTML escaping — the security-conscious bit

`esc()` converts `& < > " '` into `&amp; &lt;` etc. before user text is placed into
HTML. This prevents **XSS** (cross-site scripting): if a user signs up with the name
`<script>alert(1)</script>`, it renders as harmless visible text instead of running.
You'll see `esc(...)` wrapped around nearly every piece of dynamic text — a very good
habit the code demonstrates (the few places raw text is inserted, e.g. lesson
explanations, are trusted author-written HTML that intentionally contains `<b>` tags).

### 6.9 Other small but instructive pieces

- `uid()` — random id generator: `Math.random().toString(36).slice(2,10)`.
- **SVG icons** (file 17): scalable vector icons written as inline `<svg>` strings —
  no icon font, no image downloads, recolorable with `currentColor`.
- **Custom event pattern** and **hash routing** — covered above.
- `window.scrollTo({top:0,behavior:"smooth"})` — smooth-scroll to top on navigation.
- `String(secs).padStart(2,'0')` — "7" → "07" for the countdown clock.
- `toLocaleString()` — "1,640" with thousands separators on the leaderboard.

---

## 7. File-by-file walkthrough (what actually happens in each)

### `01-utils.js` — the toolbox
`$` and `$$` (element finders), `esc()` (HTML escaper), `uid()` (random ids), `hash()`
(demo password scrambler). ~14 lines that everything else depends on.

### `02-store.js` — persistence
`store.get/set/del` — the localStorage wrapper with in-memory fallback, JSON
encoding/decoding, and try/catch error swallowing.

### `03-data.js` — the seed data (all the content)
Everything the app "knows" on first run:
- `SKILLS` — 8 grammar skills (tenses, articles, prepositions…).
- `LESSONS` — 6 full lessons: explanation (with bold HTML), examples, and
  multiple-choice questions with correct-answer index and per-question explanations.
- `SEED` — 7 users (1 admin + 6 students with ratings), 6 achievements, 3 contests
  (1 upcoming + 2 closed) with 4 questions each, 4 communities with session times and
  feed posts, 6 events (debate, movie night, mock interviews…), a 6-entry leaderboard,
  and an empty admin audit log.
Contest dates are generated relative to `Date.now()` so the demo always looks fresh.

### `04-state.js` — memory
Loads/creates `DB`, reads `SESSION`, defines the transient `state` object and the user
helpers (`me()`, `getUser`, `myAttempts`, `dbArr`).

### `05-router.js` — navigation + guards
`AUTH_VIEWS` (Set of 13 login-required views), `needAuth()`, and `go(view, opts)`:
block unauthorized users with the login modal, demote non-admins away from admin
views, update `state`, call `render()`, scroll to top.

### `06-render.js` — the dispatcher
One big `if/else` chain: `state.view === "learn" → $("#app").innerHTML =
viewLearn()`, and so on for 15 views, with a fallback to home. Also refreshes the
navbar/footer and fires the `appRendered` event. This is the heart of the SPA.

### `07-nav-footer.js` — chrome + toasts
`renderNav()` rebuilds the top bar (links, avatar, Dashboard/Admin/Logout buttons —
or Login/Signup), builds the mobile menu, and `renderFooter()` renders the 4-column
footer. `toast(msg, type)` creates a pop-up message that auto-dismisses.

### `08-views-public.js` — public pages
Landing page (hero with headline, stats, floating blobs, feature pillars), "How It
Works" steps, and About/Contact with a form that just shows a toast (nothing is sent
anywhere).

### `09-auth.js` — accounts
Login / signup / reset modal forms (rendered into the modal container), `doLogin`,
`doSignup`, `doReset`, `logout` — as detailed in §6.6. New users are routed into
onboarding.

### `10-onboarding.js` — 3-step setup
Step 1: pick a goal (IELTS, Interview…). Step 2: self-assessed CEFR level (A1–C2 —
the standard European language scale). Step 3: an 8-question **placement diagnostic**;
each answer is stored per skill, producing the initial "weak areas" map, and awards
the first achievement.

### `11-views-learn.js` — dashboard + lessons
- `weakAreas()` aggregates accuracy per skill from lesson attempts **and** the
  diagnostic, sorts worst-first.
- `viewLearn()` renders progress (attempts/8 capped at 100%), current rating +
  percentile, recommended lesson (the weakest skill), skill bars colored
  strong/developing/weak, and recent activity.
- `viewLesson()` is the **lesson player**: explanation → examples → questions with
  instant right/wrong feedback and reasoning, progress bar, and a completion card.
  Every answer is recorded as an "attempt" in the DB — that's how weak areas and
  progress get computed later.

### `12-views-practice.js` — practice + fake AI
Speaking/writing tabs, a prompt based on your goal, a response textarea, and
`simulateFeedback()` — a **rule-based fake**: it counts words and sentences with
regexes and returns canned advice ("add more detail…", "check tense consistency…").
Clearly labeled as assistance, not a real score. Responses are saved to `DB.practice`
and shown on the profile.

### `13-views-arena.js` — contests
`countdown()` formats the time until the next contest. `enterContest()` starts the
1-second `setInterval` timer and the player: answer locking (you can't change an
answer), question navigation chips, auto-submit at 0:00. `finishContest()` scores,
builds a per-skill breakdown, computes a rating delta
(`round((score − 60% of total) × 12)`), a rank/percentile vs the seeded leaderboard,
updates the user's rating and peak, records history, awards a badge, and shows a
result screen with a "Share" button (which just shows a toast).

### `14-views-profile.js` — leaderboard + profile
Leaderboard table (global/weekly/monthly tabs — all showing the same seeded data),
your rank and percentile. Profile: stats, achievements/badges, practice history, and a
public/private visibility toggle.

### `15-views-social.js` — community features
CO-LAB: browse communities, join (membership rows in `DB.cMembers`), open a feed
modal. ACT-LAB: browse events and register (increments a counter). Achievements grid;
`award(id)` grants a badge to the current user (once).

### `16-views-admin.js` — admin panel
Stats cards (users/learners/contests/events), **live user search** (`oninput` triggers
a partial re-render of just the user rows), role management (promote/ban), lesson /
contest / event creation forms that write into the DB, and an audit log of admin
actions.

### `17-icons-init.js` — icons + boot
Defines the 7 inline-SVG icons, then on `DOMContentLoaded`: registers the
`hashchange` handler (so the browser back/forward buttons work), wires the hamburger
button, and calls `go("home")` to draw the first screen.

---

## 8. The complete data-flow picture

```
 FIRST VISIT
   SEED (03-data.js)  ──clone──▶  DB  ──store.set──▶  localStorage["vartha_db"]

 EVERY VISIT AFTER
   localStorage ──JSON.parse──▶  DB (04-state.js)

 USER CLICKS SOMETHING
   onclick="go('learn')" ─▶ go() [guard check] ─▶ state.view="learn"
                        ─▶ render() ─▶ viewLearn() returns HTML string
                        ─▶ $("#app").innerHTML = ...   (screen updates)

 USER DOES SOMETHING (answer, join, submit…)
   handler function ─▶ mutate DB (dbArr("attempts").push(...))
                   ─▶ save()  ─▶ localStorage updated
                   ─▶ render() ─▶ screen shows new state

 LOGIN
   doLogin() ─▶ SESSION = user.id ─▶ localStorage["vartha_session"]
   every view asks me() = "who is SESSION?" to personalize/guard
```

---

## 9. What is deliberately NOT used (and what that means)

| Not present | What it would normally be |
|---|---|
| React / Vue / Angular | JS frameworks that auto-sync data ↔ screen. Here `render()` re-draws everything manually instead |
| npm / Node.js | Package manager and server-side JS runtime. Nothing to install — no `node_modules`, no `package.json` |
| Webpack / Vite / Babel | Build tools that bundle/transform code. The browser runs the files exactly as written |
| Bootstrap / Tailwind | CSS frameworks. All styles hand-written |
| Backend / API / `fetch()` | There is **not a single network request** in the whole app. No server receives your login or quiz answers |
| Real database | `localStorage` plays the role of the database |
| Real AI | "Feedback" is canned rules based on word count |
| Real auth/crypto | Toy hash, session = a plain id in storage |

**Consequence:** it's a perfect learning prototype and demo, but per-user data lives
only in *that one browser* (two users on different computers see different "databases"),
anyone can read/modify the stored data via browser dev-tools, and passwords are not
really protected. The README is explicit that a production version needs a backend,
a real database, and proper password hashing.

---

## 10. Running it

No build step at all:

```bash
cd Varta-Lab
python3 -m http.server 8000      # any static file server works
# open http://localhost:8000
```

…or simply double-click `index.html` (it also works over `file://`).

**Demo accounts (seeded):**
- Admin: `admin@vartalab.in` / `admin123`
- Student: `ananya@example.com` / `pass123` (same password for rahul/priya/dev/ishita/meera `@example.com`)

---

## 11. Skills cheat-sheet — what you'd learn from studying this code

1. **SPA architecture by hand** — router, views, render loop, guards.
2. **State + persistence** — global state object, localStorage, JSON round-trips.
3. **Modern CSS** — variables, grid, flexbox, `clamp()`, media queries, gradients,
   glassmorphism, keyframes, utility classes.
4. **Modern JS** — template literals, arrow functions, destructuring, spread, `??`,
   array methods, `Set`, regex, timers, dates.
5. **DOM patterns** — string templating into `innerHTML`, class toggling, event
   handlers, custom events, live search with partial re-render.
6. **App concepts in miniature** — auth flow, sessions, roles, audit logs,
   achievements, ratings/ELO-style scoring, leaderboard percentiles, onboarding funnels.

If you can read this codebase comfortably, you understand what frameworks like React
are automating for you — and you'd be ready to learn one with solid foundations.
