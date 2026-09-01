/* =====================================================================
   VARTALAB — view: Practice (speaking/writing with simulated feedback)
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ PRACTICE ============ */
const PRACTICE_PROMPTS={
  "IELTS":{tx:"Writing Task 2, part 1","p":"Some people think online learning will replace traditional classrooms. Do you agree or disagree? Give reasons and examples."},
  "Interview":{tx:"Interview Q1","p":"Tell me about yourself and why you're interested in this role."},
  "Academic":{tx:"Academic writing","p":"Describe the main trends in a line graph showing urban population growth (2000-2025)."},
  "General":{tx:"Everyday conversation","p":"Describe a memorable meal you had. When and where was it? Who were you with?"}
};
function viewPractice(){
  const u=me();
  const tab=state.practiceTab||"speaking";
  return `
  <div class="app">
    ${sideNav("practice")}
    <div class="main" style="max-width:820px">
      <div class="page-head"><div><h2>Practice</h2><p>Speaking & writing practice with structured feedback.</p></div></div>
      <div class="tabs mb-24">
        <button class="${tab==='speaking'?'active':''}" onclick="switchPractice('speaking')">🎤 Speaking</button>
        <button class="${tab==='writing'?'active':''}" onclick="switchPractice('writing')">✍️ Writing</button>
      </div>
      <div class="card pad mb-24">
        <div class="field"><label>Goal</label>
          <select id="pGoal" onchange="practiceGoalChange()">
            ${["IELTS","Interview","Academic","General"].map(g=>`<option ${u.goal===g?'selected':''}>${g}</option>`).join("")}
          </select>
        </div>
        <div class="aicb mt-8">
          <span class="muted small">Practice timer</span>
          <div id="pTimer" style="font-weight:800;font-size:1.1rem;color:var(--brand)">2:00</div>
        </div>
      </div>
      <div class="card pad">
        <span class="sk">Prompt</span>
        <p style="font-size:1.05rem;margin-top:8px;font-weight:600">${PRACTICE_PROMPTS[u.goal||"General"].p}</p>
        <div class="field mt-16"><label>Your response</label>
          <textarea id="pResp" rows="7" placeholder="${tab==='speaking'?'Type what you would say,or record yourself if enabled.':'Type your written response here.'}"></textarea>
        </div>
        <div class="aicb">
          <button class="btn btn-ghost" onclick="resetPractice()">Reset</button>
          <button class="btn btn-primary" onclick="submitPractice('${tab}')">${tab==='speaking'?'Submit & review':'Submit for feedback'}</button>
        </div>
        <div id="pFeedback"></div>
      </div>
    </div>
  </div>`;
}
function switchPractice(t){ state.practiceTab=t; render(); }
let pTimerInt;
function practiceGoalChange(){ /* goal selection stored */ }
function resetPractice(){ $("#pResp").value=""; $("#pFeedback").innerHTML=""; toast("Cleared."); }
function submitPractice(tab){
  const txt=$("#pResp").value.trim();
  if(txt.length<15){ toast(tab==="speaking"?"Please add at least a couple of sentences.":"Your response is too short — add more detail.","err"); return; }
  // simple simulated feedback engine (extensible for real AI later)
  const fb=simulateFeedback(txt);
  dbArr("practice").push({id:uid(),userId:SESSION,type:tab,goal:$("#pGoal").value,prompt:PRACTICE_PROMPTS[$("#pGoal").value||"General"].p,response:txt,feedback:fb,ts:Date.now()});
  save();
  $("#pFeedback").innerHTML=`<div class="feedback ok show mt-24" style="border:1px solid #cdeed6">
    <b>Feedback</b>
    <p style="margin-top:6px">${esc(fb.quality)}</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
      ${fb.points.map(p=>`<div style="display:flex;gap:8px;align-items:flex-start"><span style="color:var(--green);font-weight:800">✓</span><span>${esc(p)}</span></div>`).join("")}
    </div>
    <p class="small mt-16" style="color:var(--muted)">${esc(fb.note)}</p>
    <div class="flex mt-16" style="gap:10px;flex-wrap:wrap">
      <button class="btn btn-soft btn-sm" onclick="startLessonForSkill('${fb.recSkill}')">Practice ${esc(skillName(fb.recSkill))}</button>
      <button class="btn btn-ghost btn-sm" onclick="go('learn')">Go to grammar practice</button>
    </div>
  </div>`;
  toast("Response submitted & scored.");
}
function simulateFeedback(txt){
  const wc=txt.split(/\s+/).length;
  const dict=". ";
  const sentenceCount=(txt.match(/[.!?]+/g)||[]).length;
  let quality = wc<40?"Good start — add more depth and specific examples.":
    wc>=40&&wc<80?"Solid response with clear structure and relevant detail.":"Excellent — well-developed and cohesive.";
  const points=[];
  if(sentenceCount<2) points.push("Break your response into clearer sentences for better flow.");
  else points.push("Good sentence variety and structure.");
  if(wc<30) points.push("Expand your ideas with a reason or an example to reach the word count.");
  else points.push("Good length and development for this goal.");
  points.push("Check verb tense consistency and article use as you revise.");
  return {quality,points,note:"AI feedback is assistance for learning — it is not an official IELTS score and should be reviewed by a mentor before you rely on it.",recSkill:wc<40?"svo":"cond"};
}
