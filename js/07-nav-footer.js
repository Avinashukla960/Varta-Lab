/* =====================================================================
   VARTALAB — navbar, mobile menu, footer, toast notifications
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ NAV ============ */
function renderNav(){
  const u=me();
  const links = [
    ["home","Home"],["how","How It Works"],["learn","Learn"],["arena","IELTS Arena"],
    ["practice","Practice"],["colab","CO-LAB"],["actlab","ACT-LAB"],["leaderboard","Leaderboard"],
    ["profile","Profile"],["about","About"]
  ];
  let html = links.map(([k,lbl])=>{
    let href = k==="how"?"#/how":("#/"+k);
    return `<a href="${href}" class="${state.view===k?'active':''}" onclick="go('${k}');return false;">${lbl}</a>`;
  }).join("");
  $("#topnav").innerHTML=html;

  const cta = u
    ? `<span style="display:flex;align-items:center;gap:10px">
         <span style="display:flex;align-items:center;gap:8px">
           <span class="avatar" style="width:32px;height:32px;border-radius:50%;background:${u.avatar}">${esc(u.name.split(" ")[0][0])}</span>
           <span style="font-weight:700;font-size:.9rem">${esc(u.name.split(" ")[0])}</span>
         </span>
         <button class="btn btn-primary btn-sm" onclick="gotoProfile()">Dashboard</button>
         ${u.role==="admin"?`<button class="btn btn-soft btn-sm" onclick="go('admin');return false;">Admin</button>`:""}
         <button class="btn btn-ghost btn-sm" onclick="logout()">Log out</button>
       </span>`
    : `<button class="btn btn-ghost btn-sm" onclick="openAuth('login')">Log in</button>
       <button class="btn btn-primary btn-sm" onclick="openAuth('signup')">Sign up</button>`;
  $("#navcta").innerHTML=cta;

  // mobile menu
  let m = links.map(([k,lbl])=>`<a href="#/${k}" onclick="go('${k}');toggleMenu();return false;">${lbl}</a>`).join("");
  m += `<div class="menu-cta">` + (u
    ? `<a style="text-align:center;color:var(--brand)" onclick="toggleMenu();">${esc(u.name)}</a>
       <button class="btn btn-primary btn-block" onclick="toggleMenu();go('profile');">Dashboard</button>
       ${u.role==="admin"?`<button class="btn btn-soft btn-block" onclick="toggleMenu();go('admin');">Admin</button>`:""}
       <button class="btn btn-ghost btn-block" onclick="toggleMenu();logout();">Log out</button>`
    : `<button class="btn btn-primary btn-block" onclick="toggleMenu();openAuth('signup');">Sign up for free</button>
       <button class="btn btn-ghost btn-block" onclick="toggleMenu();openAuth('login');">Log in</button>`);
  $("#mmenu").innerHTML=m;
}
function gotoProfile(){ go(me()? (me().role==="admin"?"admin":"profile") : "home"); }
function toggleMenu(){ $("#mmenu").style.display = $("#mmenu").style.display==="flex"?"none":"flex"; }
const _burger=()=>toggleMenu();

/* ============ FOOTER ============ */
function renderFooter(){
  $("#footer").innerHTML=`
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="brand-foot" style="margin-bottom:14px"><span class="mark"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 5l7 14L20 5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Vartalab</div>
        <p style="color:#9aa3b8;font-size:.92rem;max-width:300px">A student-focused English communication platform. Learn grammar-first, practise with confidence, and see your progress.</p>
        <div class="chip-row" style="margin-top:16px">
          <span class="tag teal" style="background:rgba(255,255,255,.09);color:#7fe3d4">Learn</span>
          <span class="tag brand" style="background:rgba(255,255,255,.09);color:#b9aaff">CO-LAB</span>
          <span class="tag accent" style="background:rgba(255,255,255,.09);color:#ffb394">ACT-LAB</span>
        </div>
      </div>
      <div>
        <h4>Product</h4>
        <a href="#/learn" onclick="go('learn');return false;">Learn</a>
        <a href="#/arena" onclick="go('arena');return false;">IELTS Arena</a>
        <a href="#/practice" onclick="go('practice');return false;">Practice</a>
        <a href="#/colab" onclick="go('colab');return false;">CO-LAB</a>
        <a href="#/actlab" onclick="go('actlab');return false;">ACT-LAB</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="#/about" onclick="go('about');return false;">About</a>
        <a href="#/how" onclick="go('how');return false;">How it works</a>
        <a href="#/contact" onclick="go('about');return false;">Contact</a>
        <a href="#/about" onclick="go('about');return false;">Terms of service</a>
        <a href="#/about" onclick="go('about');return false;">Privacy policy</a>
      </div>
      <div>
        <h4>Support</h4>
        <a href="mailto:support@vartalab.in">support@vartalab.in</a>
        <a href="#/colab" onclick="go('colab');return false;">Join a community</a>
        <a href="#/actlab" onclick="go('actlab');return false;">Attend an event</a>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Vartalab. All rights reserved.</span>
      <span>Practice contests are not official IELTS examinations.</span>
    </div>
  </div>`;
}

/* ============ TOAST ============ */
function toast(msg, type="success"){
  const t=document.createElement("div");
  t.className="toast "+type;
  t.textContent=msg;
  $("#toasts").appendChild(t);
  setTimeout(()=>{t.style.opacity="0";t.style.transform="translateY(8px)";},2600);
  setTimeout(()=>t.remove(),2900);
}
