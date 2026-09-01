/* =====================================================================
   VARTALAB — inline SVG icon set + app bootstrap / hash routing
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ ICONS ============ */
const ic={
  book:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 012-2h12a1 1 0 011 1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h8M8 11h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3z" stroke="currentColor" stroke-width="1.8"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 21V4m0 1h12l-2 4 2 4H5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  group:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 20a6 6 0 0112 0M16 5a3 3 0 010 6M21 20a6 6 0 00-4-5.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  rank:'<svg viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21a8 8 0 0116 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};
const icons={grad:ic.book,group:ic.group,flag:ic.flag};

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded",()=>{
  // handle hash routing
  const handleHash=()=>{
    const h=location.hash.replace("#/","")||"home";
    const known=["home","how","about","learn","lesson","practice","arena","contest","result","leaderboard","profile","colab","actlab","admin","contact","onboarding"];
    if(known.includes(h)){ go(h); }
  };
  window.addEventListener("hashchange",handleHash);
  $("#burger").addEventListener("click",()=>toggleMenu());
  // if logged in as admin default? no; open home
  // auto-navigate if there's a session and user hasn't finished onboarding
  go(me() ? "home" : "home");
  if(me() && !me().goal) { /* leave to home; dashboard prompts */ }
});
