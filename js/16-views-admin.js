/* =====================================================================
   VARTALAB — view: Admin panel
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ ADMIN ============ */
function viewAdmin(){
  const u=me(); if(!u||u.role!=="admin") return "";
  const users=DB.users;
  const contests=DB.contests;
  const attempts=dbArr("attempts");
  return `
  <div class="app">
    ${sideNav("admin")}
    <div class="main">
      <div class="page-head"><div><h2>Admin panel</h2><p>Manage content, users, contests and events.</p></div>
        <button class="btn btn-ghost btn-sm" onclick="adminLog('panel')">Audit log</button></div>

      <div class="grid g4">
        <div class="stat"><b>${users.length}</b><i>Users</i></div>
        <div class="stat"><b>${users.filter(x=>x.role==="user").length}</b><i>Active learners</i></div>
        <div class="stat"><b>${contests.length}</b><i>Contests</i></div>
        <div class="stat"><b>${DB.events.length}</b><i>Events</i></div>
      </div>

      <div class="grid g2 mt-24">
        <div class="card pad">
          <div class="aicb mb-16"><h3>Users</h3><input id="userSearch" placeholder="Search..." style="padding:8px 12px;border:1.5px solid var(--line);border-radius:10px;width:180px" oninput="renderUserRows()"></div>
          <div id="userRows">${userRowsHtml(null)}</div>
        </div>
        <div class="card pad">
          <div class="aicb mb-16"><h3>Lessons</h3><button class="btn btn-soft btn-sm" onclick="newLesson()">+ New lesson</button></div>
          ${LESSONS.map(l=>`<div class="aicb" style="padding:11px 0;border-bottom:1px solid var(--line-2)">
            <div><b style="font-size:.9rem">${esc(l.title)}</b><span class="muted small" style="display:block">${esc(skillName(l.skill))} · ${esc(l.diff)}</span></div>
            <div class="chip-row"><span class="tag green">Published</span><button class="btn btn-ghost btn-sm" onclick="editLesson('${l.id}')">Edit</button></div>
          </div>`).join("")}
        </div>
      </div>

      <div class="grid g2 mt-24">
        <div class="card pad">
          <div class="aicb mb-16"><h3>Contests</h3><button class="btn btn-soft btn-sm" onclick="newContest()">+ Schedule contest</button></div>
          ${contests.map(c=>`<div class="aicb" style="padding:11px 0;border-bottom:1px solid var(--line-2)">
            <div><b style="font-size:.9rem">${esc(c.title)}</b><span class="muted small" style="display:block">${c.questions.length} questions · ${c.duration} min</span></div>
            <span class="tag ${c.status==='upcoming'?'green':'brand'}">${esc(c.status)}</span>
          </div>`).join("")}
        </div>
        <div class="card pad">
          <div class="aicb mb-16"><h3>ACT-LAB events</h3><button class="btn btn-soft btn-sm" onclick="newEvent()">+ Add event</button></div>
          ${DB.events.map(e=>`<div class="aicb" style="padding:11px 0;border-bottom:1px solid var(--line-2)">
            <div><b style="font-size:.9rem">${esc(e.title)}</b><span class="muted small" style="display:block">${esc(e.type)} · ${esc(e.date)} · ${e.mode}</span></div>
            <span class="tag ${e.mode==='Online'?'teal':'accent'}">${e.reg||0}/${e.cap}</span>
          </div>`).join("")}
        </div>
      </div>

      <div class="grid g2 mt-24">
        <div class="card pad">
          <h3 style="margin-bottom:12px">Contest participation</h3>
          ${(DB.cAttempts||[]).length? (DB.cAttempts||[]).map(a=>{const usr=getUser(a.userId);const c=DB.contests.find(x=>x.id===a.contestId);return `<div class="aicb" style="padding:9px 0;border-bottom:1px solid var(--line-2)">
            <span style="font-weight:600;font-size:.88rem">${usr?esc(usr.name):'User'}</span><span class="muted small">${esc(c?c.title:'')}</span><span class="tag brand">${a.score}/${a.total}</span></div>`;}).join(""):`<div class="empty">No contest submissions yet.</div>`}
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:12px">Reports & moderation</h3>
          <div class="notice mb-16"><span>🚩</span><div>No open reports. Communities are moderated for respectful, on-topic conversation.</div></div>
          <div class="field"><label>Moderation note</label><textarea rows="3" placeholder="Add a note for the audit log..."></textarea></div>
          <button class="btn btn-soft btn-sm" onclick="adminLog('note')">Add to audit log</button>
        </div>
      </div>
    </div>
  </div>`;
}
function userRowsHtml(q){
  q=(q||"").toLowerCase();
  return DB.users.filter(x=>!q||x.name.toLowerCase().includes(q)||x.email.toLowerCase().includes(q))
    .map(x=>`<div class="aicb" style="padding:9px 0;border-bottom:1px solid var(--line-2)">
      <span class="flex aic" style="gap:10px"><span class="avatar" style="width:32px;height:32px;border-radius:50%;background:${x.avatar}">${esc(x.name[0])}</span>
      <span><b style="font-size:.88rem">${esc(x.name)}</b><span class="muted small" style="display:block">${esc(x.email)}</span></span></span>
      <span class="chip-row"><span class="tag ${x.role==='admin'?'accent':'brand'}">${x.role}</span><button class="btn btn-ghost btn-sm" onclick="manageUser('${x.id}')">Manage</button></span>
    </div>`).join("");
}
function renderUserRows(){ const q=$("#userSearch").value; $("#userRows").innerHTML=userRowsHtml(q); }
function manageUser(id){ toast("Manage account: "+id); }
function adminLog(kind){ dbArr("adminLog").push({ts:Date.now(),user:me().name,kind}); save(); toast("Audit entry recorded."); }

function newLesson(){ toast("Lesson editor opens with title, explanation, examples, questions and answer options."); }
function editLesson(id){ toast("Edit lesson "+LESSONS.find(x=>x.id===id).title); }
function newContest(){ toast("Contest scheduler: title, type, start/end, duration, rules."); }
function newEvent(){ toast("Event creator: type, title, host, date, location, capacity."); }
