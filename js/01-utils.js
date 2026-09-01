/* =====================================================================
   VARTALAB — helpers, DOM shorthands, demo password hash
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
"use strict";

const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2,10);

/* ---------- tiny hash (DEMO ONLY) ---------- */
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return "v1$"+(h>>>0).toString(36);}
