/* =====================================================================
   VARTALAB — views: Home, How it works, About + contact form
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ HOME (public) ============ */
function pillar(ic,grad,label,title,desc,href){
  return `<div class="card card-hover pillar pad" onclick="go('${href}');return false;" style="cursor:pointer">
    <span class="ic" style="background:${grad}">${ic}</span>
    <h3>${title}</h3>
    <p>${desc}</p>
    <span class="tag brand" style="align-self:flex-start;margin-top:4px">${label}</span>
  </div>`;
}
function viewHome(){
  const cat = icons;
  return `
  <section class="hero">
    <div class="wrap hero-inner">
      <div>
        <span class="hero-kicker"><span class="dot"></span> Grammar-first · Student-friendly · Mobile-first</span>
        <h1>Build your English. <br><span class="grad">Practise with confidence.</span> <br>See your progress.</h1>
        <p>Vartalab is a student-focused English communication platform. Learn grammar through short lessons, practise speaking and writing, join communities, and compete in weekly IELTS-style contests.</p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" onclick="startLearning()">Start learning<span style="font-size:1.2em;line-height:1">→</span></button>
          <button class="btn btn-ghost btn-lg" onclick="go('arena');return false;">Explore IELTS Arena</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><b>15+</b><span>Grammar skills</span></div>
          <div class="hero-stat"><b>Weekly</b><span>IELTS-style contests</span></div>
          <div class="hero-stat"><b>Live</b><span>CO-LAB communities</span></div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="demo-card">
          <div class="demo-top">
            <span class="avatar" style="background:#6d5efc">A</span>
            <div><b>Ananya S.</b><span>Goal: IELTS · Band 7 target</span></div>
            <span class="demo-chip">▲ +24</span>
          </div>
          <div class="demo-row"><span class="lbl">Weekly progress</span><b style="color:var(--brand)">68%</b></div>
          <div class="bar"><i style="width:68%"></i></div>
          <div class="demo-row"><span class="lbl">Grammar mastery</span><b style="color:var(--brand)">B2</b></div>
          <div class="bar"><i style="width:55%"></i></div>
          <div class="demo-row"><span class="lbl">This week's rating</span><b style="color:var(--accent)">1,240</b></div>
          <div class="bar amber"><i style="width:76%"></i></div>
        </div>
        <div class="demo-float float1" style="display:flex;gap:8px;align-items:center">
          <span class="tag green">🏆 Arena #41</span><b>Rank 2</b>
        </div>
        <div class="demo-float float2">
          <span class="sk">Achievement</span><br><b style="font-size:.9rem">🔥 3-week streak</b>
        </div>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">One learning loop</span>
        <h2>Learn → Practise → Participate → Compete → Progress</h2>
        <p>Every part of Vartalab is built around a single motivating cycle designed to turn effort into visible improvement.</p>
      </div>
      <div class="steps">
        ${[["Take a short diagnostic","Discover your starting level and grammar strengths."],
           ["Get your learning path","A personalised route based on your goal."],
           ["Learn grammar-first","Short explanations, examples, then guided practice."],
           ["Practise speaking & writing","Structured prompts with feedback."],
           ["Join community activities","CO-LAB groups and ACT-LAB events."],
           ["Compete in contests","Weekly IELTS-style Arena contests."],
           ["Track rating & progress","Leaderboards, badges and your profile."]]
          .map((s,i)=>`<div class="step"><span class="num">${i+1}</span><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section tight" style="padding-top:40px">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">Three core pillars</span>
        <h2>Everything you need, in one place</h2>
        <p>Structured learning, community and real competition — designed specifically for students.</p>
      </div>
      <div class="grid g3">
        ${pillar(cat.grad,"linear-gradient(135deg,var(--brand),var(--brand-2))","Learn","Structured grammar-first learning","Short grammar lessons, interactive questions and instant feedback that record your weak areas.","learn")}
        ${pillar(cat.group,"linear-gradient(135deg,var(--teal),#0f766e)","CO-LAB","Community groups & live sessions","Join communities by goal and level, take part in moderated sessions and support your peers.","colab")}
        ${pillar(cat.flag,"linear-gradient(135deg,#ff7a54,#ff5a36)","ACT-LAB","Activities & events","Debates, movie nights, poetry, mock interviews and competitions online or in person.","actlab")}
      </div>
    </div>
  </section>

  <section class="section" style="background:#fff">
    <div class="wrap">
      <div class="grid g2" style="align-items:center;gap:40px">
        <div>
          <span class="sk">Why grammar-first?</span>
          <h2 style="margin:12px 0 16px">A solid grammar base makes every other skill stronger</h2>
          <p class="muted" style="margin-bottom:18px">Most learners struggle with the same handful of grammar concepts. Vartalab isolates those concepts, teaches them clearly, then reinforces them through speaking, writing and weekly contests — so the rule actually sticks.</p>
          <ul style="display:flex;flex-direction:column;gap:12px">
            ${[["Diagnostic pinpoints your weak areas","We tag every answer to a specific grammar concept."],
               ["Short, focused lessons","Explanations, examples, then practice in minutes."],
               ["Mistakes become a learning plan","Your dashboard shows which skills need attention."]]
              .map(x=>`<li style="display:flex;gap:10px;align-items:flex-start">
                <span style="width:24px;height:24px;flex-shrink:0;border-radius:8px;background:var(--green-soft);color:var(--green);display:grid;place-items:center;font-weight:800">✓</span>
                <div><b>${x[0]}</b><p class="muted" style="font-size:.9rem">${x[1]}</p></div></li>`).join("")}
          </ul>
        </div>
        <div>
          <div class="card pad">
            <div class="aicb" style="margin-bottom:14px"><b>Grammar mastery</b><span class="tag green">Weak areas</span></div>
            <div style="display:flex;flex-direction:column;gap:14px">
              ${[["Present perfect",62],["Conditionals",40],["Articles",85],["Prepositions",70],["Reported speech",32]]
                .map(s=>`<div>
                  <div class="aicb" style="margin-bottom:6px"><span class="small" style="font-weight:600">${s[0]}</span><span class="small muted">${s[1]}%</span></div>
                  <div class="bar ${s[1]<45?'amber':''}"><i style="width:${s[1]}%"></i></div>
                </div>`).join("")}
            </div>
            <button class="btn btn-primary btn-block mt-16" onclick="go('learn');return false;">Boost your weak areas</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">Weekly IELTS-style contests</span>
        <h2>Compete in the IELTS Arena</h2>
        <p>Timed practice contests with a score, rank and rating change. Practice contests — not an official IELTS examination.</p>
      </div>
      <div class="grid g3">
        ${["#41 · Closed","#40 · Closed","#39 · Closed"].map((t,i)=>`
          <div class="card card-hover pad">
            <div class="aicb"><span class="tag ${i===0?'green':i===1?'amber':'brand'}">${t}</span><span class="rating-badge">1,240</span></div>
            <h3 style="margin-top:10px">Weekly IELTS Arena</h3>
            <p class="muted small" style="margin-top:6px">Timed practice · 4 questions · 20 minutes</p>
            <div class="aicb mt-16" style="font-weight:700;font-size:.9rem">Top scorer <span>Band 7.2</span></div>
          </div>`).join("")}
      </div>
      <div class="center mt-24"><button class="btn btn-accent btn-lg" onclick="go('arena');return false;">Join the Arena</button></div>
    </div>
  </section>

  <section class="section" style="background:#fff">
    <div class="wrap">
      <div class="grid g2" style="align-items:center;gap:36px">
        <div class="right" style="display:grid;justify-items:end">
          <div class="card pad" style="max-width:360px;width:100%">
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">
              <span class="avatar" style="background:#7c3aed">P</span>
              <div><b>Priya K.</b><span class="muted" style="font-size:.8rem">Goal: Higher Studies</span></div>
              <span class="rating-badge" style="margin-left:auto">1,320</span>
            </div>
            <div class="aicb small"><span style="font-weight:600">Overall progress</span><b>72%</b></div>
            <div class="bar" style="margin:6px 0 16px"><i style="width:72%"></i></div>
            <div class="chip-row"><span class="tag brand">📚 12 lessons</span><span class="tag green">⚔️ 3 contests</span><span class="tag amber">🔥 3-week streak</span></div>
          </div>
        </div>
        <div>
          <span class="sk">Personal progress</span>
          <h2 style="margin:12px 0 16px">Your progress, rating and achievements — all in one profile</h2>
          <p class="muted" style="margin-bottom:18px">Track your learning goal, current rating, highest rating, percentile, contest history, skill progress and badges. Control whether your profile is public or private.</p>
          <button class="btn btn-primary" onclick="gotoProfile()">See your profile</button>
        </div>
      </div>
    </div>
  </section>

  <section class="section tight" style="padding-top:0;background:#fff">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow">Community activity</span>
        <h2>What's happening in CO-LAB</h2>
      </div>
      <div class="grid g2">
        ${DB.communities.slice(0,4).map(c=>`
          <div class="card card-hover pad">
            <div class="aicb"><b>${esc(c.name)}</b><span class="tag ${c.goal==='IELTS'?'accent':c.goal==='Interview'?'brand':'teal'}">${esc(c.goal)}</span></div>
            <p class="muted small" style="margin:8px 0 12px">${esc(c.desc)}</p>
            <div class="aicb">
              <span class="small muted">${c.feed.length} recent activity</span>
              <button class="btn btn-soft btn-sm" onclick="go('colab');return false;">View group</button>
            </div>
          </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="band">
        <h2>Ready to build your English?</h2>
        <p>Start with a short diagnostic, get your personalised learning path, and see real progress within days.</p>
        <button class="btn btn-white btn-lg" onclick="startLearning()">Take the diagnostic</button>
        <div style="margin-top:16px">
          <button class="btn btn-lg" style="background:rgba(255,255,255,.15);color:#fff" onclick="go('how');return false;">How it works</button>
        </div>
      </div>
    </div>
  </section>
  `;
}

function startLearning(){ me() ? go("learn") : openAuth("signup"); }

/* ============ HOW IT WORKS ============ */
function viewHow(){
  return `
  <section class="hero" style="padding-bottom:30px">
    <div class="wrap" style="text-align:center;padding:70px 0 40px;max-width:760px">
      <span class="hero-kicker" style="margin:0 auto"><span class="dot"></span> How it works</span>
      <h1>From first diagnostic to visible progress</h1>
      <p style="margin:16px auto 0;max-width:560px">Vartalab is a simple, motivating loop. Here's exactly how you move through it.</p>
    </div>
  </section>
  <section class="section tight">
    <div class="wrap" style="max-width:860px">
      <div style="display:flex;flex-direction:column;gap:14px">
        ${[["Take a short diagnostic","Tell us your goal, self-assess your level and answer a quick grammar check. You're placed on a path in minutes.","🚀"],
           ["Get your learning path","Based on your goal (IELTS, interview, higher studies, general, speaking or writing) and diagnostic result.","🧭"],
           ["Learn grammar-first","Open a short lesson — explanation, examples, then interactive questions with instant feedback.","📚"],
           ["Practise speaking & writing","Switch between Speaking and Writing, choose a goal, respond to a prompt and receive structured feedback.","🎤"],
           ["Join community activities","Meet peers in CO-LAB groups and attend ACT-LAB events like debates and mock interviews.","🤝"],
           ["Compete in weekly contests","Join the IELTS Arena for a timed practice contest and compete for the best score.","⚔️"],
           ["Track your rating & progress","See your rank, rating change, score breakdown, badges and skill growth on your profile.","📈"]]
          .map((s,i)=>`<div class="card pad" style="display:flex;gap:16px;align-items:flex-start">
            <span style="width:44px;height:44px;flex-shrink:0;border-radius:12px;background:linear-gradient(135deg,var(--brand),var(--brand-2));color:#fff;display:grid;place-items:center;font-size:1.1rem">${s[2]}</span>
            <div>
              <h3 style="margin-bottom:4px">${i+1}. ${s[0]}</h3>
              <p class="muted">${s[1]}</p>
            </div>
          </div>`).join("")}
      </div>
      <div class="notice info mt-32" style="margin-top:32px">
        <span style="font-size:1.2rem">💡</span>
        <div><b>Important:</b> Weekly contests are <b>practice contests</b> for building skill and confidence — they are not an official IELTS examination.</div>
      </div>
      <div class="center mt-24">
        <button class="btn btn-primary btn-lg" onclick="startLearning()">Start your diagnostic</button>
      </div>
    </div>
  </section>`;
}

/* ============ ABOUT / CONTACT ============ */
function viewAbout(){
  return `
  <section class="hero" style="padding-bottom:20px">
    <div class="wrap" style="text-align:center;padding:64px 0 30px;max-width:720px">
      <span class="hero-kicker" style="margin:0 auto"><span class="dot"></span> About Vartalab</span>
      <h1>Helping students speak, write and grow</h1>
      <p style="margin:16px auto 0;max-width:560px">Vartalab is a student-focused English communication platform that turns structured learning, community and competition into real, visible progress.</p>
    </div>
  </section>
  <section class="section tight">
    <div class="wrap">
      <div class="grid g3">
        ${[["📚","Learn","Grammar-first structured lessons and exercises."],
           ["🤝","CO-LAB","Community groups and moderated live sessions."],
           ["🎯","ACT-LAB","Debates, movie nights, mock interviews and competitions."]]
          .map(p=>`<div class="card pad"><div style="font-size:1.6rem">${p[0]}</div><h3 style="margin:10px 0 6px">${p[1]}</h3><p class="muted small">${p[2]}</p></div>`).join("")}
      </div>
      <div class="band mt-32" id="contactband">
        <h2>Get in touch</h2>
        <p>Questions, feedback or support — we'd love to hear from you.</p>
      </div>
      <div class="card pad" style="max-width:620px;margin:-30px auto 0;position:relative;z-index:2">
        <h3 style="margin-bottom:16px">Contact us</h3>
        <div class="field"><label>Your name</label><input id="cname" placeholder="Your name"></div>
        <div class="field"><label>Email</label><input id="cemail" type="email" placeholder="you@example.com"></div>
        <div class="field"><label>Message</label><textarea id="cmsg" rows="4" placeholder="How can we help?"></textarea></div>
        <button class="btn btn-primary btn-block" onclick="submitContact()">Send message</button>
        <p class="muted small center" style="margin-top:14px">For general support email <a href="mailto:support@vartalab.in" style="color:var(--brand)">support@vartalab.in</a></p>
      </div>
    </div>
  </section>`;
}
function submitContact(){
  const n=$("#cname").value.trim(),e=$("#cemail").value.trim(),m=$("#cmsg").value.trim();
  if(!n){return toast("Please enter your name.","err");}
  if(!e||!/[^@ ]+@[^@ ]+[.][^@ ]+/.test(e)){return toast("Please enter a valid email.","err");}
  if(!m){return toast("Please enter a message.","err");}
  toast("Thanks! Your message has been sent.");
  $("#cname").value=$("#cemail").value=$("#cmsg").value="";
}
