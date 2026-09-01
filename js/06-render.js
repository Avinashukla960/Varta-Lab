/* =====================================================================
   VARTALAB — top-level render dispatcher
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ RENDER ============ */
function render(){
  renderNav();
  const app=$("#app");
  const v=state.view;
  if(v==="home") app.innerHTML=viewHome();
  else if(v==="how") app.innerHTML=viewHow();
  else if(v==="about") app.innerHTML=viewAbout();
  else if(v==="learn") app.innerHTML=viewLearn();
  else if(v==="lesson") app.innerHTML=viewLesson();
  else if(v==="practice") app.innerHTML=viewPractice();
  else if(v==="arena") app.innerHTML=viewArena();
  else if(v==="contest") app.innerHTML=viewContest();
  else if(v==="result") app.innerHTML=viewResult();
  else if(v==="leaderboard") app.innerHTML=viewLeaderboard();
  else if(v==="profile") app.innerHTML=viewProfile();
  else if(v==="colab") app.innerHTML=viewColab();
  else if(v==="actlab") app.innerHTML=viewActLab();
  else if(v==="onboarding") app.innerHTML=viewOnboarding();
  else if(v==="admin") app.innerHTML=viewAdmin();
  else app.innerHTML=viewHome();
  renderFooter();
  window.dispatchEvent(new Event("appRendered"));
}
