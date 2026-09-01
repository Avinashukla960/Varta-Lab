/* =====================================================================
   VARTALAB — views: IELTS Arena, contest player, results + countdown
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ IELTS ARENA ============ */
function countdown(ms){
  if(ms<=0) return "Live now";
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);
  return d>0?`${d}d ${h}h ${m}m`:(h>0?`${h}h ${m}m`:`${m}m`);
}
function viewArena(){
  const now=Date.now();
  const up=DB.contests.find(c=>c.status==="upcoming");
  const closed=DB.contests.filter(c=>c.status==="closed");
  const myCA=contestAttemptsOf(SESSION);
  return `
  <div class="app">
    ${sideNav("arena")}
    <div class="main" style="max-width:960px">
      <div class="page-head"><div><h2>IELTS Arena</h2><p>Weekly practice contests, scores and rankings.</p></div></div>
      <div class="notice mb-24">
        <span style="font-size:1.1rem">⚠️</span>
        <div>These are <b>practice contests</b> to build skill and confidence. They are <b>not an official IELTS examination</b>.</div>
      </div>

      ${up?`
      <div class="card pad" style="border:1.5px solid #e0e3ff;background:linear-gradient(180deg,#fff,#fbfaff)">
        <div class="aicb mb-16">
          <span class="tag accent">Next contest</span>
          <span style="font-weight:800;font-size:.95rem">${esc(up.title)}</span>
        </div>
        <div class="aicb" style="gap:20px;flex-wrap:wrap;margin-bottom:20px">
          <div><span class="sk">Countdown</span><b style="font-size:1.8rem;color:var(--brand);display:block">${countdown(up.start-now)}</b></div>
          <div><span class="sk">Duration</span><b style="font-size:1.25rem;display:block">${up.duration} min</b></div>
          <div><span class="sk">Questions</span><b style="font-size:1.25rem;display:block">${up.questions.length}</b></div>
          <div><span class="sk">Type</span><b style="font-size:1.25rem;display:block">${esc(up.type)}</b></div>
        </div>
        <div class="mb-16"><span class="sk">Rules</span>
          <ul style="margin-top:8px;display:flex;flex-direction:column;gap:6px;font-size:.9rem">
            ${up.rules.map(r=>`<li style="display:flex;gap:8px"><span style="color:var(--accent)">•</span>${esc(r)}</li>`).join("")}
          </ul>
        </div>
        <button class="btn btn-accent btn-lg" onclick="enterContest('${up.id}')">Participate</button>
      </div>`:`<div class="empty">No upcoming contest right now.</div>`}

      <div class="grid g2 mt-24" style="grid-template-columns:1.4fr 1fr">
        <div class="card pad">
          <h3 style="margin-bottom:16px">Previous contests</h3>
          ${closed.map((c,i)=>`
            <div class="aicb" style="padding:14px 0;border-bottom:1px solid var(--line-2)">
              <div><b style="font-size:.95rem">${esc(c.title)}</b><span class="muted small" style="display:block">${c.questions.length} questions · ${c.duration} min</span></div>
              <span class="tag ${i===0?'green':'brand'}">view results</span>
            </div>`).join("")}
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:16px">Your past results</h3>
          ${myCA.length? myCA.slice(-5).reverse().map(a=>{
            const c=DB.contests.find(x=>x.id===a.contestId);
            return `<div class="aicb" style="padding:12px 0;border-bottom:1px solid var(--line-2)">
              <div><b style="font-size:.9rem">${esc(c?c.title:"Contest")}</b><span class="muted small" style="display:block">Rank #${a.rank}</span></div>
              <span class="rating-badge">${a.ratingDelta>=0?'+':''}${a.ratingDelta} pts</span>
            </div>`;}).join("") : `<div class="empty"><div style="font-size:1.5rem">🏆</div>No contests yet. Join the next one!</div>`}
        </div>
      </div>
    </div>
  </div>`;
}

function enterContest(cid){
  const c=DB.contests.find(x=>x.id===cid);
  if(!c) return;
  if(c.status!=="upcoming"){ toast("This contest is closed.","err"); return; }
  state.contestId=cid; state.cIdx=0; state.cAnswers={}; state.cLeft=c.duration*60; state.cLive=true; state.cActive=setInterval(contestTick,1000);
  go("contest");
}

/* ============ CONTEST SCREEN ============ */
function viewContest(){
  const c=DB.contests.find(x=>x.id===state.contestId);
  if(!c){ return `<div class="wrap section"><div class="empty">Contest not found.</div></div>`; }
  const q=c.questions[state.cIdx];
  const answered=state.cAnswers[state.cIdx]!==undefined;
  const mins=Math.floor(state.cLeft/60),secs=state.cLeft%60;
  return `
  <div class="app">
    <div class="main" style="max-width:820px">
      <div class="page-head">
        <div><h2 style="font-size:1.3rem">${esc(c.title)}</h2><p>Question ${state.cIdx+1} of ${c.questions.length}</p></div>
        <div style="font-size:1.3rem;font-weight:800;color:${state.cLeft<120?'var(--rose)':'var(--brand)'}">${mins}:${String(secs).padStart(2,'0')}</div>
      </div>
      <div class="bar mb-24"><i style="width:${(state.cIdx+1)/c.questions.length*100}%"></i></div>

      <div class="card pad">
        <div class="aicb mb-12"><span class="sk">Q${state.cIdx+1} · ${esc(skillName(q.skill))}</span><span class="tag teal">${c.type}</span></div>
        <h3 style="margin-bottom:16px">${esc(q.q)}</h3>
        <div class="grid g2">
          ${q.opts.map((o,i)=>{
            let cls="qopt"; if(answered){ if(i===q.a)cls+=" correct"; } else if(state.cAnswers[state.cIdx]===i)cls+=" selected";
            return `<button class="${cls}" ${answered?'disabled':''} onclick="answerContest(${i})"><span class="key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`;
          }).join("")}
        </div>
        <p class="muted small" style="margin-top:16px">${answered?'Answer locked. Use the navigation below.':'Select an answer, then continue.'}</p>
        <div class="aicb mt-16" style="flex-wrap:wrap;gap:10px">
          <div class="chip-row">
            ${c.questions.map((_,i)=>`<button onclick="navContest(${i})" style="width:34px;height:34px;border-radius:9px;border:1.5px solid ${state.cAnswers[i]!==undefined?'var(--brand)':'var(--line)'};background:${state.cAnswers[i]!==undefined?'var(--brand)':'#fff'};color:${state.cAnswers[i]!==undefined?'#fff':'var(--ink-2)'};font-weight:700">${i+1}</button>`).join("")}
          </div>
          <button class="btn btn-ghost btn-sm" onclick="navContest(${state.cIdx-1})" ${state.cIdx===0?'disabled':''}>Prev</button>
          ${state.cIdx+1<c.questions.length
            ? `<button class="btn btn-soft btn-sm" onclick="navContest(${state.cIdx+1})">Next</button>`
            : `<button class="btn btn-accent btn-sm" onclick="finishContest()">Finish & submit</button>`}
        </div>
      </div>
      <p class="muted small center mt-16">© Vartalab IELTS Arena — practice contest, not an official IELTS examination. Answers are revealed only after you submit.</p>
    </div>
  </div>`;
}
function answerContest(i){
  const c=DB.contests.find(x=>x.id===state.contestId);
  state.cAnswers[state.cIdx]=i; render();
}
function navContest(i){
  if(i<0||i>=DB.contests.find(x=>x.id===state.contestId).questions.length)return;
  state.cIdx=i; render();
}
let contestTicks=0;
function contestTick(){
  state.cLeft--; state.cTicks=(state.cTicks||0)+1;
  if(state.cLeft<=0){ finishContest(); return; }
  if(state.view==='contest') render();
}
function finishContest(){
  clearInterval(state.cActive);
  const c=DB.contests.find(x=>x.id===state.contestId);
  if(!c)return;
  let score=0,breakdown={};
  c.questions.forEach((q,i)=>{
    const ok=state.cAnswers[i]===q.a;
    if(ok)score++;
    breakdown[q.skill]=(breakdown[q.skill]||0)+(ok?1:0);
  });
  // rating change
  const u=me();
  const delta=Math.round((score-c.questions.length*0.6)*12);
  const newRating=(u.rating||1000)+delta;
  const {rank, percentile}=computeRank(score,c.questions.length);
  const ca={id:uid(),userId:SESSION,contestId:c.id,answers:{...state.cAnswers},score,total:c.questions.length,rank,percentile,ratingDelta:delta,rating:newRating,breakdown,ts:Date.now()};
  dbArr("cAttempts").push(ca); save();
  if(u.role==="user"){
    u.rating=newRating; u.peak=Math.max(u.peak||1000,newRating);
    if(!DB.ratings)DB.ratings=[]; DB.ratings.push({userId:SESSION,rating:newRating,ts:Date.now()});
    save();
  }
  award("a-contest");
  state.doneCA=ca;
  go("result");
}

function computeRank(score,total){
  // simple percentile relative to leaderboard pts
  const others=DB.leaderboard.length+1;
  const percentile=Math.max(1,Math.min(99,Math.round(score/total*95)));
  const rank=Math.max(1,Math.round(others-(score/total*others))+1);
  return {rank,percentile};
}

/* ============ CONTEST RESULTS ============ */
function viewResult(){
  const ca=state.doneCA||contestAttemptsOf(SESSION).slice(-1)[0];
  if(!ca) return `<div class="wrap section"><div class="empty">No results yet.</div></div>`;
  const c=DB.contests.find(x=>x.id===ca.contestId);
  const correct=ca.score, incorrect=ca.total-ca.score;
  return `
  <div class="app">
    <div class="main" style="max-width:820px">
      <div class="card pad center" style="margin-bottom:24px">
        <span class="tag green" style="margin:0 auto">Contest complete</span>
        <h2 style="margin:12px 0 4px">${esc(c?c.title:"Contest")}</h2>
        <p class="muted">Score ${correct}/${ca.total} · Time submitted</p>
        <div style="display:flex;gap:30px;justify-content:center;margin:26px 0;flex-wrap:wrap">
          <div><span class="sk">Score</span><b style="font-size:2rem;color:var(--brand);display:block">${correct}/${ca.total}</b></div>
          <div><span class="sk">Rank</span><b style="font-size:2rem;display:block">#${ca.rank}</b></div>
          <div><span class="sk">Percentile</span><b style="font-size:2rem;display:block">${ca.percentile}th</b></div>
          <div><span class="sk">Rating change</span><b style="font-size:2rem;display:block;color:${ca.ratingDelta>=0?'var(--green)':'var(--rose)'}">${ca.ratingDelta>=0?'+':''}${ca.ratingDelta}</b></div>
        </div>
        <div class="row":"" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <span class="tag green">✓ ${correct} correct</span>
          <span class="tag rose">✕ ${incorrect} incorrect</span>
          <span class="tag brand">★ ${ca.rating} rating</span>
        </div>
        <div class="chip-row" style="justify-content:center;margin-top:18px">
          <button class="btn btn-primary btn-sm" onclick="shareResult()">Share result</button>
          <button class="btn btn-ghost btn-sm" onclick="go('arena')">Back to Arena</button>
        </div>
        <p class="muted small" style="margin-top:14px">Practice contest — not an official IELTS examination.</p>
      </div>

      <div class="grid g2">
        <div class="card pad">
          <h3 style="margin-bottom:16px">Skill breakdown</h3>
          ${ca.breakdown&&Object.keys(ca.breakdown).length? Object.entries(ca.breakdown).map(([sk,sc])=>`
            <div class="aicb" style="padding:9px 0;border-bottom:1px solid var(--line-2)">
              <span style="font-weight:600;font-size:.9rem">${esc(skillName(sk))}</span><span class="tag ${sc?'green':'rose'}">${sc?'✓':'✕'}</span>
            </div>`).join(""):`<div class="empty">No breakdown.</div>`}
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:8px">Recommended practice</h3>
          <p class="muted small" style="margin-bottom:14px">Focus here to boost your next rating.</p>
          ${incorrect>0?`<div class="aicb"><div><b style="font-size:.92rem">Weak areas</b><span class="muted small" style="display:block">${Math.round(incorrect/ca.total*100)}% of your answers were missed</span></div>
          <button class="btn btn-soft btn-sm" onclick="startLessonForSkill('cond')">Practise</button></div>`:`
          <div class="empty" style="padding:0">Perfect score — keep it up! 🎯</div>`}
          <div class="card mt-16" style="background:var(--surface-2);box-shadow:none">
            <span class="sk">Contest history</span>
            <p class="small mt-8">You have completed <b>${contestAttemptsOf(SESSION).length}</b> Arena contests.</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function shareResult(){ toast("🔗 Profile link copied"); }
