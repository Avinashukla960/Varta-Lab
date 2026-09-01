/* =====================================================================
   VARTALAB — hash router / navigation guard
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ ROUTER ============ */
const AUTH_VIEWS = new Set(["dashboard","learn","lesson","practice","arena","contest","result","leaderboard","profile","colab","actlab","admin","onboarding"]);
function needAuth(view){ return AUTH_VIEWS.has(view) || view.startsWith("admin"); }

function go(view, opts={}){
  if(needAuth(view) && !me()){
    toast("Please log in to continue.","err");
    openAuth("login");
    return;
  }
  if(view.startsWith("admin") && me() && me().role!=="admin"){
    toast("Admin access only.","err");
    view="profile";
  }
  state.view=view;
  if(opts.lessonId) state.lessonId=opts.lessonId;
  if(opts.contestId) state.contestId=opts.contestId;
  if(opts.practiceTab) state.practiceTab=opts.practiceTab;
  if(opts.lbTab) state.lbTab=opts.lbTab;
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}
