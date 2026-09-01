# Varta-Lab — Explained for a C++ Programmer
### "What is used here, step by step" — every JavaScript idea translated to C++

---

# PART A — The mental model shift (read this first)

| | C++ | This project (JavaScript) |
|---|---|---|
| Where it runs | You compile → `.exe` → OS runs it | Browser downloads text files → **interprets them live**. No compiler, no `.exe` |
| Entry point | `int main()` | **There is no main()**. Code runs top-to-bottom as each `<script>` file loads |
| Declaration order | Headers, prototypes, then use | Same idea: the 17 files are **numbered** so definitions load before use |
| Type system | Static: `int x;` `std::string s;` | **Dynamic**: a variable is a box that can hold *anything*, types live in the values |
| Memory | `new`/`delete`, stack vs heap | Garbage-collected. You never free memory |
| UI | You'd use Qt / graphics code | The browser gives you the page as an **object tree (the DOM)** you can rewrite at runtime |
| Files share? | Separate translation units, linker | All 17 files share **one global scope** — like pasting them into one giant `.cpp` |

**The single biggest new concept:** `document.querySelector(...)` returns a *live pointer* to a piece of the visible web page. Assign to its `.innerHTML` and the screen instantly re-renders. That's the project's entire "graphics engine".

---

# PART B — Language features used, each with the C++ twin

## B1. `const` / `let` — variables
```js
const SKILLS = [...];   // like const std::vector — can't reassign the name
let DB;                 // like a normal variable, assignable
```
No type names. Ever. Think: every variable is `auto`, and `auto` that can even change type.

## B2. `function` and arrow functions `=>`
```js
function skillName(id){ ... }              // classic function
const uid = () => Math.random()...;        // arrow function
const $ = (s, el=document) => el.querySelector(s);  // default parameter (= C++ default arg)
```
C++ equivalent of the arrow function:
```cpp
auto uid = []() { /* ... */ };
auto query = [](std::string s, Element* el = document) { /* ... */ };
```
Functions are **values**: stored in variables, passed to other functions (no `&` or `*` needed).

## B3. Objects `{}` — a struct and a map fused together
```js
const u = { id:"u-1", name:"Ananya", rating:1240 };
u.name                 // field access, like u.name in C++
u["rating"]            // also works — the object IS a map<string, anything>
u.avatar = "#6d5efc";  // add a NEW field at runtime — impossible for a C++ struct
```
Think: `struct` you can grow + `std::map<std::string, std::any>` that you access with `.`.

## B4. Arrays `[]` — like `std::vector`
```js
const opts = ["go","goes","gone"];
opts.length                 // size()
opts.map(o => "• " + o)     // transform every element (≈ std::transform)
opts.filter(o => o.length>3)// keep matches (≈ std::copy_if)
opts.find(o => o==="goes")  // first match (≈ std::find_if)
opts.some(o => o==="goes")  // any match (≈ std::any_of)
opts.slice(-4).reverse()    // last 4, reversed
```
These replace most `for` loops you'd write in C++.

## B5. Template literals — formatted strings
```js
`<h2>${esc(u.name)}</h2> · ${u.rating} pts`
```
≈ C++20 `std::format("<h2>{}</h2> · {} pts", name, rating)`. This is how **every screen of the app is built**: functions that assemble giant HTML strings.

## B6. Destructuring & spread
```js
const [k, lbl] = ["learn","Learn"];       // ≈ auto [k, lbl] = std::pair{...}; (C++17)
const copy = { ...SEED };                 // deep-copy via serialize
answers: { ...state.cAnswers }            // copy a map's pairs into a new object
```

## B7. `??`, `?.`, ternary — null safety
```js
String(s ?? "")            // ≈ s.value_or("")   (std::optional)
u?.goal                    // "if u exists, take goal, else undefined" (no crash)
cond ? "weak" : "strong"   // ≈ cond ? "weak" : "strong"  (same as C++)
```

## B8. Comparison with C++ of a real function from the project
`js/01-utils.js` — the demo password hash:
```js
function hash(s){
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return "v1$" + (h >>> 0).toString(36);
}
```
Identical logic in C++:
```cpp
std::string hash(const std::string& s) {
    int32_t h = 0;                                  // |0 forces 32-bit int
    for (char c : s)
        h = (h << 5) - h + static_cast<int32_t>(c);
    uint32_t uh = static_cast<uint32_t>(h);         // h >>> 0
    return "v1$" + toBase36(uh);                    // toString(36)
}
```
Same bit math you already know — different syntax only.

## B9. `Set` — like `std::set`
```js
const AUTH_VIEWS = new Set(["learn","arena","admin"]);
AUTH_VIEWS.has("learn")   // O(1) lookup, ≈ mySet.count("learn")
```

## B10. JSON — serialization built into the language
```js
const text = JSON.stringify(DB);   // struct/map  → text   (≈ serialize to file)
const db   = JSON.parse(text);     // text        → object (≈ deserialize)
```
Used constantly because the "database" can only store strings.

## B11. Timers & the event loop — **no threads!**
```js
setInterval(fn, 1000)   // call fn every 1000 ms — registers a callback, does NOT sleep
setTimeout(fn, 2600)    // call fn once after 2600 ms
clearInterval(id)       // stop it
```
JavaScript is **single-threaded**. There is no `std::thread`. Instead you say *"browser, please run this function later"* and continue. The browser maintains an event queue (the **event loop**). The contest countdown works exactly like this: every second the browser calls `contestTick()`.

---

# PART C — The three browser APIs that have no C++ equivalent

## C1. The DOM (Document Object Model)
The browser parses `index.html` into a tree of objects:
```
document
└── <body>
    ├── <header class="nav"> …navbar…
    ├── <main id="app">            ← EMPTY container
    ├── <footer id="footer">       ← empty
    ├── <div id="modal">           ← hidden popup
    └── <div id="toasts">          ← notification corner
```
JS grabs nodes and rewrites them:
```js
const app = document.querySelector("#app");  // get pointer to the <main>
app.innerHTML = viewLearn();                 // replace its subtree with new HTML
```
It's as if your GUI library let you do `window->children = parseLayout(newLayoutString);` and it repaints instantly.

## C2. Events — the observer pattern, built in
```js
document.addEventListener("DOMContentLoaded", startApp); // "page ready" ≈ after-construction hook
window.addEventListener("hashchange", handleHash);       // URL #part changed
$("#burger").addEventListener("click", toggleMenu);      // button clicked
```
The project also uses **inline handlers inside generated HTML**:
```js
`<button onclick="startLesson('l-tenses')">Open</button>`
```
The string `startLesson('l-tenses')` is code the browser will run on click — it *must* be a global function, which is exactly why all files share one global scope.

## C3. `localStorage` — a persistent key→string store
```js
localStorage.setItem("vartha_db",  JSON.stringify(DB));  // save (survives restart!)
const db = JSON.parse(localStorage.getItem("vartha_db"));
```
Like an auto-saved `std::map<std::string, std::string>` owned by the browser, private to that site and that user. The project wraps it in `store` with a RAM fallback when the browser blocks it (try/catch ≈ exception handling).

---

# PART D — The data model (read as C++ structs)

Everything the app knows is plain data. In C++ terms the "database" would be:

```cpp
struct User      { string id, name, email, phone, ph;   // ph = hashed password
                   string role, goal, level, vis, avatar;
                   int rating = 1000, peak = 1000; };

struct Question  { string q;                 vector<string> opts;
                   int a;                    // index of correct option
                   string expl, skill; };    // why the answer is right

struct Lesson    { string id, skill, title, diff, tag, expl;
                   vector<string> examples;  vector<Question> questions; };

struct Contest   { string id, title, type, status;
                   int duration; long start, end;        // timestamps (ms)
                   vector<string> rules; vector<Question> questions; };

struct Attempt   { string id, userId, lessonId, skill; bool correct; long ts; };

struct ContestAttempt { string id, userId, contestId;
                   map<string,int> answers;  int score, total, rank, percentile;
                   int ratingDelta, rating;  map<string,int> breakdown; long ts; };

struct Community { string id, name, desc, goal, level, moderator;
                   vector<string> members; /* + sessions, feed */ };

struct DB        { vector<User> users;  vector<Lesson> lessons;
                   vector<Contest> contests;  vector<Community> communities;
                   vector<Event> events;  vector<LbEntry> leaderboard;
                   vector<Achievement> achievements;
                   vector<Attempt> attempts;         // grows at runtime
                   vector<ContestAttempt> cAttempts; // grows at runtime
                   vector<Diagnostic> diagnostics;   // … and a few more };
```
- `SEED` (file 03) = the initial constant copy of `DB`, created at load time.
- `DB` (file 04) = the working copy: loaded from localStorage, else cloned from SEED.
- `save()` = `JSON.stringify(DB)` → localStorage (the "commit to disk" call).
- `state` = transient UI variables (current view, quiz index, countdown seconds) — deliberately not persisted.

---

# PART E — Step-by-step execution (the whole app's "main loop")

### Phase 1 — Startup (runs once, top to bottom)
1. Browser fetches `index.html`, builds the DOM tree, applies `css/styles.css`.
2. `<script>` tags at the end of `<body>` execute **in numeric order**:
   - **01-utils.js** — defines `$`, `$$`, `esc`, `uid`, `hash` (utility functions).
   - **02-store.js** — defines the `store` wrapper (get/set/del around localStorage).
   - **03-data.js** — builds `SEED`: 7 users (passwords run through `hash()`), 6 lessons with questions, 3 contests (dates computed from `Date.now()`), 4 communities, 6 events, leaderboard. ≈ global constructors before main.
   - **04-state.js** — `DB = store.get("vartha_db")`; if null → `DB = copy(SEED)` and save. Reads `SESSION`. Declares `state`.
   - **05–16** — *only function definitions* (router, render, all views). Nothing runs yet. ≈ prototypes waiting to be called.
   - **17-icons-init.js** — defines the SVG icon strings, then:
     ```js
     document.addEventListener("DOMContentLoaded", () => { ... go("home"); });
     ```
     Registers the real "main": run once the page is fully built.

### Phase 2 — First paint
3. Browser finishes the DOM → fires `DOMContentLoaded` → the callback runs:
   registers `hashchange` handling (back/forward buttons), wires the hamburger menu, calls `go("home")`.
4. `go("home")` (file 05): auth check (home is public) → `state.view = "home"` → `render()`.
5. `render()` (file 06): `renderNav()` fills the navbar; big if/else switch on `state.view` → `viewHome()` **returns an HTML string** → `$("#app").innerHTML = that string` → browser parses it → **the page is visible**. `renderFooter()`, smooth scroll to top.

### Phase 3 — The event loop (runs forever — this IS the "main loop")
```
USER ACTION                HANDLER                     EFFECT
─────────────────────────  ──────────────────────────  ─────────────────────────────
click "Learn"              go('learn')                 guard → state.view → render()
click an answer            answerLesson(id, i)         push Attempt into DB, save(), render()
click "Join community"     joinCommunity(id)           push member row, save(), render()
submit practice            submitPractice()            compute feedback, save(), render()
enter contest              enterContest(cid)           start setInterval(1000) → each tick:
                                                        state.cLeft--, render(); at 0 → finish
finish contest             finishContest()             score, rating delta, rank, save(), go('result')
login                      doLogin()                   SESSION = user.id → saved → render()
```
Every handler follows the same 3-step pattern — this is the core rhythm of the app:
```js
// 1. MUTATE the data          2. PERSIST          3. RE-RENDER
dbArr("attempts").push(a);     save();             render();
```

### Phase 4 — Page navigation detail (the SPA trick)
- URL `…/#/learn` → changing only the `#` part never reloads the page; it fires `hashchange` → `handleHash()` → `go("learn")`.
- Auth guard: `go()` checks `AUTH_VIEWS.has(view) && !me()` → if not logged in: `toast()` + login modal instead.
- Admin guard: view starts with "admin" → requires `me().role === "admin"`.

---

# PART F — File → role → C++ analogy (one line each)

| # | File | Role in the app | C++ analogy |
|---|---|---|---|
| 01 | utils.js | `$`, `esc`, `uid`, `hash` | your `utils.hpp` helpers |
| 02 | store.js | localStorage wrapper | a tiny `KeyValueStore` class |
| 03 | data.js | SEED content | global constant data tables |
| 04 | state.js | DB, SESSION, state, `me()` | the app's singletons + globals |
| 05 | router.js | `go()` + guards | navigation/route controller |
| 06 | render.js | `render()` dispatcher | the "switch on state → draw screen" |
| 07 | nav-footer.js | navbar/menu/footer/toast | static chrome widgets + logger |
| 08 | views-public.js | home/how/about screens | UI builders returning strings |
| 09 | auth.js | signup/login/reset | the auth module |
| 10 | onboarding.js | goal/level/diagnostic | a wizard/quiz state machine |
| 11 | views-learn.js | dashboard + lesson player | main feature logic |
| 12 | views-practice.js | practice + fake feedback | grading function (rule-based) |
| 13 | views-arena.js | contests, timer, scoring | timed exam engine + rating calc |
| 14 | views-profile.js | leaderboard/profile | reporting views |
| 15 | views-social.js | communities/events/badges | social features |
| 16 | views-admin.js | admin panel | admin console |
| 17 | icons-init.js | SVG icons + boot | "main()" — registers startup |

---

# PART G — What to tell yourself when reading the code

1. `"use strict"` ≈ turning on extra compiler warnings.
2. Anywhere you'd write a `for` loop pushing into a vector — here it's `.map()`.
3. Anywhere you'd `printf`/`std::format` a string — here it's a template literal.
4. Anywhere you'd have a `struct` — here it's an object literal, grown at runtime.
5. Anywhere you'd spawn a thread or sleep — here it's `setTimeout`/`setInterval` callbacks.
6. The whole app = **data in objects → functions build HTML strings from data → browser paints → clicks call functions → data changes → repaint**. One loop. That's it.
