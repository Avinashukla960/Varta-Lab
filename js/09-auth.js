/* =====================================================================
   VARTALAB — auth modals: signup, login, password reset, logout
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ AUTH MODALS ============ */
function openAuth(mode){
  $("#modal").classList.add("open");
  $("#modalBody").innerHTML=`
    <div class="aicb" style="margin-bottom:6px">
      <span class="brand" style="font-size:1.1rem"><span class="mark" style="width:30px;height:30px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 5l7 14L20 5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Vart<em>alab</em></span>
      <button onclick="closeModal()" style="background:none;border:none;font-size:1.4rem;color:var(--muted)">×</button>
    </div>
    <p class="muted small" style="margin-bottom:18px">Vartalab is an educational platform to help you build your English.</p>
    ${mode==="signup"?signupHtml():mode==="reset"?resetHtml():loginHtml()}
    <div style="text-align:center;margin-top:16px;font-size:.88rem" class="muted">${mode==="signup"
      ? `Already have an account? <a href="#" onclick="openAuth('login');return false;" style="color:var(--brand);font-weight:700">Log in</a>`
      : `New here? <a href="#" onclick="openAuth('signup');return false;" style="color:var(--brand);font-weight:700">Create an account</a>`}</div>
  `;
}
function loginHtml(){
  return `
    <div class="field"><label>Email or phone</label><input id="loginu" placeholder="you@example.com or +91..."></div>
    <div class="field"><label>Password</label><input id="loginp" type="password" placeholder="••••••••"></div>
    <div class="aicb" style="margin-bottom:16px">
      <label class="small" style="display:flex;align-items:center;gap:6px;font-weight:600"><input type="checkbox" id="remember" checked> Remember me</label>
      <a href="#" onclick="openAuth('reset');return false;" style="color:var(--brand);font-weight:700;font-size:.82rem">Forgot password?</a>
    </div>
    <div class="err" id="loginErr"></div>
    <button class="btn btn-primary btn-block" onclick="doLogin()">Log in</button>
  `;
}
function signupHtml(){
  return `
    <div class="field"><label>Full name</label><input id="su-name" placeholder="Your full name"></div>
    <div class="field"><label>Email</label><input id="su-email" type="email" placeholder="you@example.com"></div>
    <div class="field"><label>Phone (optional)</label><input id="su-phone" placeholder="+91 98765 43210"></div>
    <div class="field"><label>Password</label><input id="su-pass" type="password" placeholder="At least 8 characters"></div>
    <label class="small" style="display:flex;gap:8px;align-items:flex-start;margin-bottom:14px">
      <input type="checkbox" id="su-terms" style="margin-top:3px">
      <span style="font-weight:600">I agree to the <a href="#/about" style="color:var(--brand)" onclick="closeModal();return false;">Terms</a> and <a href="#/about" style="color:var(--brand)" onclick="closeModal();return false;">Privacy Policy</a>.</span>
    </label>
    <div class="err" id="suErr"></div>
    <button class="btn btn-primary btn-block" onclick="doSignup()">Create account</button>
  `;
}
function resetHtml(){
  return `
    <div class="field"><label>Registered email</label><input id="rs-email" type="email" placeholder="you@example.com"></div>
    <div class="field"><label>New password</label><input id="rs-pass" type="password" placeholder="New password"></div>
    <div class="err" id="rsErr"></div>
    <button class="btn btn-primary btn-block" onclick="doReset()">Reset password</button>
    <div style="text-align:center;margin-top:14px"><a href="#" onclick="openAuth('login');return false;" style="color:var(--brand);font-weight:700;font-size:.88rem">Back to login</a></div>
  `;
}
function closeModal(){ $("#modal").classList.remove("open"); }

function doSignup(){
  const name=$("#su-name").value.trim(),email=$("#su-email").value.trim().toLowerCase(),phone=$("#su-phone").value.trim();
  const pass=$("#su-pass").value, terms=$("#su-terms").checked, err=$("#suErr");
  err.classList.remove("show");
  const fail=(m)=>{err.textContent=m;err.classList.add("show");};
  if(name.length<2)return fail("Please enter your full name.");
  if(!/[^@ ]+@[^@ ]+[.][^@ ]+/.test(email))return fail("Please enter a valid email.");
  if(pass.length<8)return fail("Password must be at least 8 characters.");
  if(!terms)return fail("Please accept the Terms and Privacy Policy.");
  if(DB.users.some(u=>u.email===email))return fail("An account with this email already exists.");
  const av = ["#6d5efc","#0d9488","#e11d48","#f59e0b","#16a34a","#7c3aed"][Math.floor(Math.random()*6)];
  const u={id:"u-"+uid(),name,email,phone,ph:hash(pass),role:"user",goal:null,level:null,vis:"public",avatar:av,rating:1000,peak:1000};
  DB.users.push(u); save();
  SESSION=u.id; store.set("vartha_session",u.id);
  closeModal();
  toast("Welcome to Vartalab, "+name.split(" ")[0]+"!");
  go("onboarding");
}

function doLogin(){
  const ident=$("#loginu").value.trim().toLowerCase(),pass=$("#loginp").value,err=$("#loginErr");
  err.classList.remove("show");
  const u=DB.users.find(x=>x.email===ident||x.phone===ident);
  if(!u||u.ph!==hash(pass)){err.textContent="Incorrect email/phone or password.";err.classList.add("show");return;}
  SESSION=u.id; store.set("vartha_session",u.id); closeModal();
  toast("Welcome back, "+u.name.split(" ")[0]+"!");
  go(u.role==="admin"?"admin":"profile");
}

function doReset(){
  const email=$("#rs-email").value.trim().toLowerCase(),pass=$("#rs-pass").value,err=$("#rsErr");
  err.classList.remove("show");
  const u=DB.users.find(x=>x.email===email);
  if(!u){err.textContent="No account found with this email.";err.classList.add("show");return;}
  if(pass.length<8){err.textContent="Password must be at least 8 characters.";err.classList.add("show");return;}
  u.ph=hash(pass); save();
  toast("Password updated. Please log in.");
  openAuth("login");
}

function logout(){ SESSION=null; store.del("vartha_session"); state.view="home"; render(); toast("You've logged out."); }
