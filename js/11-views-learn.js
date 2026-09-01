/* =====================================================================
   VARTALAB — views: Learn dashboard + lesson player
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ LEARN DASHBOARD ============ */
function skillName(id){ const s=SKILLS.find(x=>x.id===id); return s?s.name:id; }
function completedSkillCount(){
  const att=dbArr("attempts").filter(a=>a.userId===SESSION&&a.correct!==undefined);
  return att;
}
function weakAreas(){
  // aggregate accuracy by skill from attempts + diagnostic
  const map={};
  dbArr("attempts").forEach(a=>{
    if(a.userId!==SESSION)return;
    if(!map[a.skill])map[a.skill]={c:0,t:0};
    map[a.skill].t++; if(a.correct)map[a.skill].c++;
  });
  const diag=(DB.diagnostics||[]).find(d=>d.userId===SESSION);
  if(diag){ Object.keys(diag.skills||{}).forEach(s=>{
    if(!map[s])map[s]={c:0,t:0};
    map[s].t++; if(diag.skills[s])map[s].c++;
  });}
  const rows=Object.entries(map).map(([sk,v])=>({sk,acc:Math.round(v.c/v.t*100)}));
  return rows.sort((a,b)=>a.acc-b.acc);
}
function recommendLesson(){
  const wa=weakAreas();
  if(wa.length) { const s=wa[0].sk; const l=LESSONS.find(x=>x.skill===s); if(l) return l; }
  return LESSONS[0];
}
function viewLearn(){
  const u=me(); if(!u)return "";
  const pending = !u.goal || !u.level || !(DB.diagnostics||[]).some(d=>d.userId===SESSION);
  const wa=weakAreas();
  const rec=recommendLesson();
  const totalAttempts=dbArr("attempts").filter(a=>a.userId===SESSION).length;
  const completed=dbArr("attempts").filter(a=>a.userId===SESSION&&a.lessonId&&a.finished).length;
  const streak=(DB.streak&&DB.streak[SESSION])||3;
  return `
  <div class="app" id="appshell">
    ${sideNav("learn")}
    <div class="main">
      ${pending?`<div class="notice info mb-24">
        <span style="font-size:1.2rem">🧭</span>
        <div><b>Finish your setup to unlock your full path.</b> Take the diagnostic to get a personalised learning plan.
        <button class="btn btn-primary btn-sm" style="margin-left:8px" onclick="go('onboarding')">Take diagnostic</button></div>
      </div>`:""}
      <div class="page-head">
        <div><h2>Your learning dashboard</h2><p>${esc(u.name.split(" ")[0])} · Goal: ${esc(u.goal||"—")} · Level: ${esc(u.level||"—")}</p></div>
        <button class="btn btn-primary" onclick="startLesson()">Continue learning →</button>
      </div>

      <div class="grid g3" style="grid-template-columns:1.4fr 1fr 1fr">
        <div class="card pad">
          <div class="aicb mb-8"><span class="sk">Overall progress</span><b style="color:var(--brand)">${Math.min(100,Math.round(totalAttempts/8*100)) || 0}%</b></div>
          <div class="bar" style="height:12px"><i style="width:${Math.min(100,Math.round(totalAttempts/8*100))}%"></i></div>
          <div class="aicb mt-16" style="font-size:.85rem">
            <span class="muted">${completed} lessons completed</span>
            <span class="tag green">🔥 ${streak}-day streak</span>
          </div>
        </div>
        <div class="card pad">
          <span class="sk">Current rating</span>
          <div class="aicb mt-8">
            <div><b style="font-size:1.7rem;color:var(--brand)">${u.rating||1000}</b><span class="muted small"> · peak ${u.peak||1000}</span></div>
            <span class="rating-badge">★ ${percentileOf(u.id)}th</span>
          </div>
        </div>
        <div class="card pad">
          <span class="sk">Recommended lesson</span>
          <div style="margin-top:10px">
            <b style="font-size:1rem">${esc(rec.title)}</b>
            <p class="muted small mt-8">${esc(skillName(rec.skill))} · ${esc(rec.diff)}</p>
            <button class="btn btn-soft btn-sm mt-8" onclick="startLesson('${rec.id}')">Open lesson</button>
          </div>
        </div>
      </div>

      <div class="grid g2 mt-24" style="grid-template-columns:1.2fr 1fr">
        <div class="card pad">
          <div class="aicb mb-16"><h3>Grammar skill categories</h3></div>
          <div style="display:flex;flex-direction:column;gap:14px">
            ${SKILLS.slice(0,6).map(s=>{
              const row=wa.find(w=>w.sk===s.id);
              const acc=row?row.acc:50;
              return `<div>
                <div class="aicb" style="margin-bottom:6px"><span style="font-weight:600;font-size:.9rem">${esc(s.name)}</span>
                  <span class="tag ${acc>=75?'green':acc>=50?'amber':'rose'}">${acc>=75?'strong':acc>=50?'developing':'weak'}</span></div>
                <div class="bar ${acc<50?'amber':''}"><i style="width:${Math.max(8,acc)}%"></i></div>
              </div>`;
            }).join("")}
          </div>
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:4px">Weak areas</h3>
          <p class="muted small" style="margin-bottom:16px">Focus your practice here.</p>
          ${wa.length? wa.slice(0,5).map(w=>`
            <div class="aicb" style="padding:10px 0;border-bottom:1px solid var(--line-2)">
              <div><b style="font-size:.92rem">${esc(skillName(w.sk))}</b><span class="muted small" style="display:block">${w.acc}% accuracy</span></div>
              <button class="btn btn-soft btn-sm" onclick="startLessonForSkill('${w.sk}')">Practise</button>
            </div>`).join("") : `<div class="empty">No weak areas yet — keep practising! 🎉</div>`}
        </div>
      </div>

      <div class="card pad mt-24">
        <div class="aicb mb-16"><h3>Recently completed</h3><button class="btn btn-soft btn-sm" onclick="go('profile')">View all</button></div>
        ${recentAttemptsHtml()}
        <div class="aicb mt-16">
          <button class="btn btn-primary" onclick="startLesson()">Continue learning</button>
          <button class="btn btn-ghost" onclick="go('practice')">Practice again</button>
        </div>
      </div>
    </div>
  </div>`;
}

function recentAttemptsHtml(){
  const att=dbArr("attempts").filter(a=>a.userId===SESSION&&a.lessonId).slice(-4).reverse();
  if(!att.length) return `<div class="empty"><div style="font-size:1.6rem">📚</div>No lessons yet. Take the diagnostic or start your first lesson.</div>`;
  return att.map(a=>{ const l=LESSONS.find(x=>x.id===a.lessonId); return `
    <div class="aicb" style="padding:12px 0;border-bottom:1px solid var(--line-2)">
      <div><b style="font-size:.92rem">${esc(l?l.title:"Lesson")}</b><span class="muted small" style="display:block">${esc(skillName(a.skill))}</span></div>
      <span class="tag ${a.correct?'green':'rose'}">${a.correct?'✓ passed':'retry'}</span>
    </div>`;}).join("");
}

function startLessonForSkill(sk){ const l=LESSONS.find(x=>x.skill===sk); startLesson(l?l.id:null); }
function startLesson(id){
  const l=id?LESSONS.find(x=>x.id===id):recommendLesson();
  state.lessonId=l.id; state.lessonIdx=0; state.lessonScore=0; state.lessonAsk=null; state.lessonDone=false;
  go("lesson");
}

function sideNav(active){
  const items=[["learn","Learn","book"],["practice","Practice","mic"],["arena","IELTS Arena","flag"],
    ["colab","CO-LAB","group"],["actlab","ACT-LAB","cal"],["leaderboard","Leaderboard","rank"],["profile","Profile","user"]];
  const icons={book:ic.book,mic:ic.mic,flag:ic.flag,group:ic.group,cal:ic.cal,rank:ic.rank,user:ic.user};
  return `<aside class="side" id="sidebar">
    ${items.map(([k,l,i])=>`<a class="${active===k?'active':''}" onclick="go('${k}');return false;">${icons[i]}<span>${l}</span></a>`).join("")}
    ${me() && me().role==="admin"?`<div class="grp">Admin</div><a onclick="go('admin')">${icons.user}<span>Admin panel</span></a>`:""}
    <div class="side-foot">Learning is a loop. Everything you do feeds your progress.</div>
  </aside>
  <button class="btn btn-ghost btn-sm toast-btn" style="margin:0 0 12px" onclick="document.getElementById('sidebar').classList.toggle('open')">☰ Menu</button>`;
}

/* ============ LESSON SCREEN ============ */
function viewLesson(){
  const l=LESSONS.find(x=>x.id===state.lessonId)||LESSONS[0];
  const qi=state.lessonIdx||0;
  const q=l.questions[qi];
  const qa=state.lessonAsk; // index chosen or null
  const revealed=qa!==null;
  const done=state.lessonDone;
  return `
  <div class="app">
    ${sideNav("learn")}
    <div class="main" style="max-width:820px">
      <div class="aicb mb-16">
        <button class="btn btn-ghost btn-sm" onclick="go('learn')">← Back</button>
        <span class="tag brand">${esc(skillName(l.skill))}</span>
        <span class="tag ${l.tag==='IELTS'?'accent':'teal'}">${esc(l.tag)}</span>
      </div>
      <div class="page-head"><div><h2>${esc(l.title)}</h2><p>${esc(l.diff)} · ${l.questions.length} questions</p></div></div>
      <div class="bar mb-24"><i style="width:${(qi)/l.questions.length*100}%"></i></div>

      ${done? `
        <div class="card pad center">
          <div style="font-size:2.4rem">${state.lessonScore===l.questions.length?'🎉':'📘'}</div>
          <h3 style="margin:8px 0">${state.lessonScore===l.questions.length?'Great job! You aced it.':'Lesson complete'}</h3>
          <p class="muted">You answered ${state.lessonScore} of ${l.questions.length} correctly.</p>
          <div class="aicb" style="justify-content:center;gap:10px;margin-top:18px">
            <button class="btn btn-primary" onclick="startLesson('${l.id}')">Retry</button>
            <button class="btn btn-ghost" onclick="startLesson()">Next lesson</button>
          </div>
        </div>`
      : `
      <div class="card pad">
        <div class="mb-16">
          <span class="sk">Explanation</span>
          <p style="margin-top:8px;font-size:1.02rem;line-height:1.6">${l.expl}</p>
        </div>
        <div style="background:var(--surface-2);border-left:3px solid var(--brand);padding:14px 16px;border-radius:0 12px 12px 0;margin-bottom:22px">
          <span class="sk">Examples</span>
          <ul style="margin-top:8px;display:flex;flex-direction:column;gap:6px">
            ${l.examples.map(e=>`<li style="display:flex;gap:8px;align-items:flex-start;font-size:.95rem"><span style="color:var(--brand)">›</span>${e}</li>`).join("")}
          </ul>
        </div>

        <div class="aicb mb-12"><span class="sk">Question ${qi+1} of ${l.questions.length}</span></div>
        <h3 style="margin-bottom:16px">${esc(q.q)}</h3>
        <div class="grid g2">
          ${q.opts.map((o,i)=>{
            let cls="qopt"; if(revealed){ if(i===q.a)cls+=" correct"; else if(i===qa)cls+=" wrong"; } else if(i===qa)cls+=" selected";
            return `<button class="${cls}" ${revealed?'disabled':''} onclick="answerLesson('${l.id}',${i})"><span class="key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`;
          }).join("")}
        </div>

        <div class="feedback ${revealed?(qa===q.a?'ok show':'no show'):''}">
          <b>${qa===q.a?'Correct!':'Not quite.'}</b>
          <p style="margin-top:4px">${esc(q.expl)}</p>
          ${qa!==q.a?`<p class="small" style="margin-top:8px">Recorded under <b>${esc(skillName(l.skill))}</b> — it'll show up in your weak areas.</p>`:""}
          ${revealed?`<button class="btn btn-primary btn-sm mt-16" onclick="nextLessonQuestion('${l.id}')">${qi+1>=l.questions.length?'Finish lesson':'Next question'}</button>`:""}
        </div>
      </div>`
      }
    </div>
  </div>`;
}
function answerLesson(id,i){
  const l=LESSONS.find(x=>x.id===id);
  const q=l.questions[state.lessonIdx];
  state.lessonAsk=i;
  const ok=i===q.a;
  // record attempt counted as lesson-based
  if(ok) state.lessonScore=(state.lessonScore||0)+1;
  dbArr("attempts").push({id:uid(),userId:SESSION,lessonId:id,questionId:state.lessonIdx,skill:l.skill,response:i,correct:ok,tag:l.skill,ts:Date.now()});
  save();
  render();
}
function nextLessonQuestion(id){
  const l=LESSONS.find(x=>x.id===id);
  if(state.lessonIdx+1>=l.questions.length){
    dbArr("attempts").push({id:uid(),userId:SESSION,lessonId:id,skill:l.skill,finished:true,score:state.lessonScore,ts:Date.now()});
    save();
    state.lessonDone=true; state.lessonAsk=null;
    if((state.lessonScore||0)>=l.questions.length) award("a-lesson10");
    render();
  } else { state.lessonIdx++; state.lessonAsk=null; render(); }
}
