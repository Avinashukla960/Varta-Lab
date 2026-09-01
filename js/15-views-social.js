/* =====================================================================
   VARTALAB — views: CO-LAB communities, ACT-LAB events, achievements
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
function joinedCommunities(){ return (DB.cMembers||[]).filter(m=>m.userId===SESSION).map(m=>m.comId); }
function viewColab(){
  const mine=joinedCommunities();
  const hasJoined = id=>mine.includes(id);
  return `
  <div class="app">
    ${sideNav("colab")}
    <div class="main" style="max-width:960px">
      <div class="page-head"><div><h2>CO-LAB</h2><p>Community groups, live sessions and moderated conversation.</p></div></div>
      <div class="card pad mb-24">
        <div class="field" style="margin:0"><label>Filter by goal / level / topic</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${["All","IELTS","Interview","General English","Speaking","Beginner","Advanced"].map(f=>`<button class="btn btn-ghost btn-sm" onclick="filterColab('${f}')">${f}</button>`).join("")}
          </div>
        </div>
      </div>
      <div class="grid g2">
        ${DB.communities.map(c=>`
          <div class="card card-hover pad">
            <div class="aicb">
              <div><b style="font-size:1.05rem">${esc(c.name)}</b><span class="muted small" style="display:block">${esc(c.goal)} · ${esc(c.level)} · ${(c.members&&c.members.length)||0} members</span></div>
              <span class="tag ${hasJoined(c.id)?'green':'brand'}">${hasJoined(c.id)?'✓ Joined':'Open'}</span>
            </div>
            <p class="muted small" style="margin:12px 0">${esc(c.desc)}</p>
            <div class="aicb" style="padding:10px 0;border-top:1px solid var(--line-2);margin-bottom:12px">
              <span class="small" style="font-weight:600">Next session</span>
              <span class="small muted">${c.sessions&&c.sessions[0]?esc(c.sessions[0].t):"None scheduled"}</span>
            </div>
            <div class="aicb" style="gap:8px;flex-wrap:wrap">
              <button class="btn btn-soft btn-sm" onclick="joinCommunity('${c.id}')">${hasJoined(c.id)?'Open community':'Join community'}</button>
              ${c.sessions&&c.sessions.length?`<button class="btn btn-ghost btn-sm" onclick="toast('You registered for the next session!')">Register</button>`:""}
              <button class="btn btn-ghost btn-sm" onclick="openCommunity('${c.id}')">Feed</button>
            </div>
          </div>`).join("")}
      </div>
    </div>
  </div>`;
}
function joinCommunity(id){
  const mine=joinedCommunities();
  if(!mine.includes(id)){ dbArr("cMembers").push({userId:SESSION,comId:id,role:"member",joined:Date.now()}); save(); }
  openCommunity(id);
}
function openCommunity(id){
  const c=DB.communities.find(x=>x.id===id);
  state.openCom=id;
  $("#modal").classList.add("open");
  $("#modalBody").innerHTML=`
    <div class="aicb"><b style="font-size:1.2rem">${esc(c.name)}</b><button onclick="closeModal()" style="background:none;border:none;font-size:1.4rem;color:var(--muted)">×</button></div>
    <p class="muted small" style="margin:8px 0 16px">${esc(c.desc)}</p>
    <div class="aicb mb-16"><span class="tag brand">${esc(c.goal)}</span><span class="tag teal">Moderated by ${esc(c.moderator)}</span>
      <span class="muted small" style="margin-left:auto">${(c.members&&c.members.length)||0} members</span></div>
    <span class="sk">Upcoming session</span>
    ${c.sessions&&c.sessions.length?`<div class="card" style="background:var(--surface-2);box-shadow:none;padding:12px;margin:8px 0 18px">
      <b style="font-size:.95rem">${esc(c.sessions[0].t)}</b><span class="muted small" style="display:block">${esc(c.sessions[0].d)}</span></div>`:`<p class="muted small">No upcoming session.</p>`}
    <span class="sk">Recent feed</span>
    <div style="margin:8px 0 18px;display:flex;flex-direction:column;gap:10px">
      ${c.feed.map(f=>`<div class="card" style="box-shadow:none;padding:10px 12px"><span class="muted small"><b>${esc(f.u)}</b> · ${esc(f.ts)}</span><p class="small" style="margin-top:4px">${esc(f.t)}</p></div>`).join("")}
    </div>
    <div class="field"><label>Post to the community</label><input id="comPost" placeholder="Share an update..."></div>
    <button class="btn btn-primary btn-block" onclick="postCom('${id}')">Post</button>
    <p class="muted small" style="margin-top:10px">Be respectful. Report inappropriate content to your moderator.</p>
  `;
}
function postCom(id){
  const txt=$("#comPost").value.trim();
  const c=DB.communities.find(x=>x.id===id);
  if(!txt)return toast("Write something first.","err");
  c.feed.push({u:me().name,t:txt,ts:"now"});
  save(); openCommunity(id); toast("Posted!");
}
function filterColab(f){ toast("Showing "+f+" communities"); render(); }

/* ============ ACT-LAB ============ */
function viewActLab(){
  const regs = (DB.registrations||[]).filter(r=>r.userId===SESSION).map(r=>r.eventId);
  return `
  <div class="app">
    ${sideNav("actlab")}
    <div class="main" style="max-width:960px">
      <div class="page-head"><div><h2>ACT-LAB</h2><p>Activities & events — debates, movie nights, mock interviews, poetry and competitions.</p></div></div>
      <div class="card pad mb-24">
        <div class="chip-row">
          ${["All","Movie Discussion","Debate","Dialogue","Poetry","Interview Practice","Competition"].map(cat=>`<button class="btn btn-ghost btn-sm" onclick="filterAct('${cat}')">${cat}</button>`).join("")}
        </div>
      </div>
      <div class="grid g2">
        ${DB.events.map(e=>{
          const joined=regs.includes(e.id);
          const filled=Math.round((e.reg||0)/e.cap*100);
          return `<div class="card card-hover pad">
            <div class="aicb">
              <span class="tag ${e.mode==='Online'?'teal':'accent'}">${e.mode==='Online'?'🌐 Online':'📍 Offline'}</span>
              <span class="tag brand">${esc(e.type)}</span>
            </div>
            <h3 style="margin:12px 0 6px">${esc(e.title)}</h3>
            <p class="muted small" style="margin-bottom:12px">${esc(e.desc)}</p>
            <div class="card" style="background:var(--surface-2);box-shadow:none;padding:12px;margin-bottom:14px">
              <div class="aicb"><span class="small" style="font-weight:600">🗓️ ${esc(e.date)}</span><span class="muted small">Host: ${esc(e.host)}</span></div>
            </div>
            ${!joined?`<div class="mb-8">
              <div class="aicb small"><span>Seats</span><span>${e.reg||0}/${e.cap}</span></div>
              <div class="bar amber"><i style="width:${filled}%"></i></div>
            </div>`:""}
            <button class="btn ${joined?'btn-soft':'btn-primary'} btn-block" onclick="registerEvent('${e.id}')">${joined?'✓ Registered':'Register'}</button>
          </div>`;}).join("")}
      </div>
    </div>
  </div>`;
}
function registerEvent(id){
  const ev=DB.events.find(x=>x.id===id);
  if(!ev)return;
  const regs=(DB.registrations||[]).filter(r=>r.userId===SESSION).map(r=>r.eventId);
  if(regs.includes(id)){ toast("You're already registered."); return; }
  if((ev.reg||0)>=ev.cap){ toast("This event is full.","err"); return; }
  dbArr("registrations").push({id:uid(),userId:SESSION,eventId:id,status:"confirmed",ts:Date.now()});
  ev.reg=(ev.reg||0)+1; save();
  toast("You're registered for “"+ev.title+"”!");
  render();
}
function filterAct(cat){ toast("Showing "+cat+" events"); render(); }

/* ============ ACHIEVEMENTS ============ */
function award(achId){
  const exists=(DB.uAch||[]).some(a=>a.userId===SESSION&&a.achId===achId);
  if(exists)return;
  dbArr("uAch").push({userId:SESSION,achId,earned:Date.now()}); save();
  const b=DB.achievements.find(x=>x.id===achId);
  if(b) toast("🏅 Achievement unlocked: "+b.name);
}
