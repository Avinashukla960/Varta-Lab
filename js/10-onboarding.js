/* =====================================================================
   VARTALAB — onboarding + placement diagnostic quiz
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ ONBOARDING / DIAGNOSTIC ============ */
const GOALS=["IELTS","Interview","Higher Studies","General English","Speaking","Writing"];
function viewOnboarding(){
  const u=me(); if(!u) return `<div class="wrap section"><div class="empty">Please log in to continue.</div></div>`;
  const step = !u.goal ? 0 : !u.level ? 1 : 2; // 0 goal, 1 level, 2 diagnostic
  const done = (DB.diagnostics||[]).some(d=>d.userId===SESSION);
  if(step===2 && !state.diag && !done){ state.diag={idx:0,score:0,answers:{}}; }
  let body;
  if(step===0) body=onGoal();
  else if(step===1) body=onLevel();
  else if(done) body=diagnosticDoneCard();
  else body=diagnosticHtml();
  return `
  <section style="max-width:760px;margin:0 auto;padding:40px 20px 70px">
    <div class="aicb mb-24">
      <span class="sk">Step ${step+1} of 3</span>
      <span class="tag brand">${u.name.split(" ")[0]}, let's set you up</span>
    </div>
    <div class="bar mb-24"><i style="width:${(step+1)/3*100}%"></i></div>
    <div class="card pad" id="onboardBody">${body}</div>
  </section>`;
}
function diagnosticDoneCard(){
  return `<div class="center">
    <div style="font-size:2.4rem">🎉</div>
    <h3 style="margin:10px 0 6px">Diagnostic complete!</h3>
    <p class="muted">Your learning path is ready. Continue to your dashboard.</p>
    <button class="btn btn-primary btn-lg mt-16" onclick="go('learn')">Go to my dashboard</button>
  </div>`;
}

function onGoal(){
  return `
    <h2 style="margin-bottom:6px">What's your primary goal?</h2>
    <p class="muted" style="margin-bottom:22px">We'll tailor your learning path around this. You can change it anytime.</p>
    <div class="grid g2">
      ${GOALS.map(g=>`<button class="qopt" onclick="setGoal('${g}')"><span class="key">→</span><span>${g}</span></button>`).join("")}
    </div>`;
}
function setGoal(g){
  const u=me(); u.goal=g; save(); render();
}
function onLevel(){
  const u=me();
  const lvls=[["A1","Beginner"],["A2","Elementary"],["B1","Intermediate"],["B2","Upper-intermediate"],["C1","Advanced"],["C2","Proficient"]];
  return `
    <h2 style="margin-bottom:6px">How would you rate your English?</h2>
    <p class="muted" style="margin-bottom:22px">A quick self-assessment — there's no wrong answer.</p>
    <div class="grid g2">
      ${lvls.map(l=>`<button class="qopt" onclick="setLevel('${l[0]}')"><span class="key">${l[0]}</span><span>${l[1]}</span></button>`).join("")}
    </div>`;
}
function setLevel(l){ const u=me(); u.level=l; save(); render(); }

function startDiagnostic(){
  // Called from home CTA / prompts when the user wants an (re)take of the diagnostic.
  if(!(DB.diagnostics||[]).some(d=>d.userId===SESSION)){
    state.diag={idx:0,score:0,answers:{}};
  }
  go("onboarding");
}
function buildDiagnostic(){
  const ded={userId:SESSION,date:Date.now(),score:0};
  if(!DB.diagnostics) DB.diagnostics=[];
  return ded;
}
const DIAG_Q=[
  {skill:"tenses",q:"She ___ to work every day.",opts:["go","goes","going","gone"],a:1},
  {skill:"articles",q:"He is ___ university student.",opts:["a","an","the","no article"],a:0},
  {skill:"prep",q:"The exam is ___ 10 o'clock.",opts:["in","on","at","for"],a:2},
  {skill:"svo",q:"Pick the correct order.",opts:["They play football every Sunday.","They play every Sunday football.","They every Sunday play football.","Play they football every Sunday."],a:0},
  {skill:"cond",q:"If I ___ rich, I would travel.",opts:["am","was","were","be"],a:2},
  {skill:"reported",q:"He said he ___ be late.",opts:["will","would","can","is"],a:1},
  {skill:"vocab",q:"Choose the best word: 'The company will ___ a new product.'",opts:["launch","release","introduce","All of these"],a:3},
  {skill:"cohesion",q:"'However' is best used to...",opts:["add an idea","show contrast","give an example","summarise"],a:1}
];
function diagnosticHtml(){
  const s=state.diag; const q=DIAG_Q[s.idx];
  return `
    <div class="aicb mb-16"><span class="sk">Question ${s.idx+1} of ${DIAG_Q.length}</span><span class="tag brand">${esc(skillName(q.skill))}</span></div>
    <div class="bar mb-16"><i style="width:${(s.idx)/DIAG_Q.length*100}%"></i></div>
    <h3 style="margin-bottom:14px">${esc(q.q)}</h3>
    <div class="grid g2" id="diagOpts">
      ${q.opts.map((o,i)=>`<button class="qopt" onclick="answerDiag(${i})"><span class="key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`).join("")}
    </div>
    <p class="muted small mt-16">Reading/writing component will be available where practical.</p>`;
}
function answerDiag(i){
  const s=state.diag; const q=DIAG_Q[s.idx];
  state.diag.answers[q.skill]=i==q.a?1:0;
  state.diag.score+= i==q.a?1:0;
  s.idx++;
  if(s.idx>=DIAG_Q.length){ finishDiagnostic(); } else {
    $("#onboardBody").innerHTML=diagnosticHtml();
  }
}
function finishDiagnostic(){
  const s=state.diag;
  const ded={userId:SESSION,date:Date.now(),score:s.score,total:DIAG_Q.length,skills:{...s.answers}};
  dbArr("diagnostics").push(ded); save();
  // award first achievement
  award("a-first");
  toast("Diagnostic complete! Your path is ready.");
  render(); 
  // go to learn but show a little onboarding summary first
  state.view="learn"; render();
}
