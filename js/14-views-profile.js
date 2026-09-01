/* =====================================================================
   VARTALAB — views: Leaderboard + Profile
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ LEADERBOARD ============ */
function percentileOf(uid){
  const lb=DB.leaderboard.sort((a,b)=>b.pts-a.pts);
  const idx=lb.findIndex(x=>x.id===uid);
  if(idx<0)return Math.round(50);
  return Math.max(1,Math.round((idx+1)/lb.length*100));
}
function viewLeaderboard(){
  const u=me();
  const tab=state.lbTab||"global";
  const uu=u?getUser(u.id):null;
  const myPts = uu? (DB.leaderboard.find(x=>x.id===u.id)?.points||u.rating||1000):null;
  const rows = DB.leaderboard.slice().sort((a,b)=>b.pts-a.pts);
  const myIdx=rows.findIndex(r=>r.id===u.id);
  return `
  <div class="app">
    ${sideNav("leaderboard")}
    <div class="main" style="max-width:820px">
      <div class="page-head"><div><h2>Leaderboard</h2><p>Competitive rankings — no private information shown.</p></div></div>
      <div class="tabs mb-24">
        ${["global","weekly","monthly"].map((t,i)=>`<button class="${tab===t?'active':''}" onclick="switchLb('${t}')">${['Global','Weekly','Monthly'][i]}</button>`).join("")}
      </div>
      <div class="card pad" style="margin-bottom:24px">
        ${rows.map((r,i)=>{
          const usr=getUser(r.id); const isMe=(u&&u.id===r.id);
          const cls=i===0?'top':i===1?'r2':i===2?'r3':'';
          return `<div class="lb-row" style="${isMe?'background:var(--brand-soft);border-radius:12px':''}">
            <span class="rank ${cls}">${i+1}</span>
            <span class="who"><span class="avatar" style="background:${usr?usr.avatar:'#94a3b8'}">${usr?esc(usr.name[0]):'?'}</span>
              <span><b>${usr?esc(usr.name):'Learner'}</b>${isMe?'<span style="color:var(--brand)">· you</span>':''}<span>${usr?esc(usr.goal||'English learner'):'Learner'}</span></span>
            </span>
            <span class="score"><b>${(r.pts).toLocaleString()}</b><span>points</span></span>
          </div>`;}).join("")}
      </div>
      ${u?`<div class="card pad">
        <div class="aicb"><div><span class="sk">Your position</span><b style="font-size:1.4rem;color:var(--brand);display:block">Rank #${myIdx+1}</b></div>
        <div class="right"><span class="sk">Your rating</span><b style="font-size:1.4rem;display:block">${u.rating||1000}</b></div></div>
        <div class="mt-16"><span class="tag brand">Percentile ${percentileOf(u.id)}th</span><span class="tag teal">Score ${myPts}</span></div>
      </div>`:`<div class="notice info"><span>🔒</span><div>Log in to see your ranking on the leaderboard.</div></div>`}
    </div>
  </div>`;
}
function switchLb(t){ state.lbTab=t; toast(t.charAt(0).toUpperCase()+t.slice(1)+" leaderboard"); render(); }

/* ============ PROFILE ============ */
function viewProfile(){
  const u=me(); if(!u)return "";
  const ca=contestAttemptsOf(SESSION);
  const badges=dbArr("uAch").filter(a=>a.userId===SESSION).map(a=>DB.achievements.find(x=>x.id===a.achId)).filter(Boolean);
  const myLb=DB.leaderboard.find(x=>x.id===u.id);
  const recent=(DB.practice||[]).filter(p=>p.userId===SESSION).slice(-3).reverse();
  return `
  <div class="app">
    ${sideNav("profile")}
    <div class="main" style="max-width:900px">
      <div class="card pad" style="margin-bottom:24px">
        <div class="flex aic" style="gap:18px;flex-wrap:wrap">
          <span class="avatar" style="width:64px;height:64px;border-radius:18px;background:${u.avatar};font-size:1.5rem">${esc(u.name[0])}</span>
          <div class="grow">
            <h2 style="font-size:1.4rem">${esc(u.name)}</h2>
            <p class="muted">Goal: <b>${esc(u.goal||"—")}</b> · Level: <b>${esc(u.level||"—")}</b> · Profile: <b>${u.vis==="public"?"Public":"Private"}</b></p>
          </div>
          <div class="right"><span class="rating-badge">★ ${u.rating||1000}</span>
            <p class="muted small mt-8">Peak ${u.peak||1000} · #${myLb?DB.leaderboard.indexOf(myLb)+1:"-"} global</p>
          </div>
        </div>
        <div class="aicb mt-16" style="flex-wrap:wrap;gap:10px">
          <button class="btn btn-soft btn-sm" onclick="shareResult()">Share profile</button>
          <label class="btn btn-ghost btn-sm" style="cursor:pointer"><input type="checkbox" ${u.vis==="public"?"checked":""} onchange="toggleVisibility()" style="display:none"> ${u.vis==="public"?"Public profile":"Private profile"}</label>
          <button class="btn btn-ghost btn-sm" onclick="go('onboarding')">Edit goal</button>
        </div>
      </div>

      <div class="grid g3">
        <div class="card pad"><span class="sk">Contests</span><b style="font-size:1.6rem;color:var(--brand);display:block">${ca.length}</b><span class="muted small">completed</span></div>
        <div class="card pad"><span class="sk">Peak rating</span><b style="font-size:1.6rem;display:block">${u.peak||1000}</b><span class="muted small">highest</span></div>
        <div class="card pad"><span class="sk">Percentile</span><b style="font-size:1.6rem;display:block">${percentileOf(u.id)}th</b><span class="muted small">top %</span></div>
      </div>

      <div class="grid g2 mt-24" style="grid-template-columns:1.3fr 1fr">
        <div class="card pad">Vartalab.html
          <h3 style="margin-bottom:16px">Contest history</h3>
          ${ca.length? ca.slice(-6).reverse().map(a=>{
            const c=DB.contests.find(x=>x.id===a.contestId);
            return `<div class="aicb" style="padding:11px 0;border-bottom:1px solid var(--line-2)">
              <span style="font-weight:600;font-size:.9rem">${esc(c?c.title:"Contest")}</span>
              <span class="chip-row"><span class="tag ${a.ratingDelta>=0?'green':'rose'}">${a.score}/${a.total}</span><span class="rating-badge">${a.ratingDelta>=0?'+':''}${a.ratingDelta}</span></span>
            </div>`;}).join(""):`<div class="empty"><div style="font-size:1.4rem">⚔️</div>No contests yet.</div>`}
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:16px">Skill progress</h3>
          ${weakAreas().slice(0,5).map(w=>{const s=SKILLS.find(x=>x.id===w.sk);return s?`
            <div class="aicb mb-8"><span style="font-weight:600;font-size:.85rem">${esc(s.name)}</span><span class="muted small">${w.acc}%</span></div>
            <div class="bar mb-8"><i style="width:${w.acc}%"></i></div>`:"";}).join("")}
        </div>
      </div>

      <div class="grid g2 mt-24">
        <div class="card pad">
          <h3 style="margin-bottom:16px">Achievements & badges</h3>
          <div class="grid g3">
            ${badges.length? badges.map(b=>`<div class="badge-g"><span class="bx" style="background:var(--brand-soft);font-size:1.4rem">${esc(b.ic)}</span><b>${esc(b.name)}</b><span>${esc(b.desc)}</span></div>`).join(""):`<div class="empty" style="grid-column:1/-1"><div style="font-size:1.4rem">🏅</div>Earn badges by learning, practising and competing.</div>`}
          </div>
        </div>
        <div class="card pad">
          <h3 style="margin-bottom:16px">Recent activity</h3>
          ${recent.length? recent.map(p=>`
            <div class="aicb" style="padding:10px 0;border-bottom:1px solid var(--line-2)">
              <span style="font-weight:600;font-size:.88rem">${p.type==="speaking"?"🎤 Speaking":"✍️ Writing"} practice</span>
              <span class="tag teal">${esc(p.goal)}</span>
            </div>`).join(""):`<div class="empty">No recent practice. Try a writing or speaking drill.</div>`}
          <button class="btn btn-primary btn-block mt-16" onclick="go('practice')">Practise now</button>
        </div>
      </div>
    </div>
  </div>`;
}
function toggleVisibility(){
  const u=me(); u.vis=u.vis==="public"?"private":"public"; save(); render(); toast("Profile is now "+u.vis+".");
}

