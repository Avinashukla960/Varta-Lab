/* =====================================================================
   VARTALAB — app state: DB, session, user helpers
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ STATE ============ */
let DB = store.get("vartha_db", null);
if(!DB){ DB = JSON.parse(JSON.stringify(SEED)); store.set("vartha_db", DB); }
function save(){ store.set("vartha_db", DB); }
let SESSION = store.get("vartha_session", null);
let state = { view:"home", contestId:null, lessonId:null, practiceTab:"speaking", lbTab:"global", learnCat:null };

function me(){ return SESSION ? DB.users.find(u=>u.id===SESSION) : null; }
function getUser(id){ return DB.users.find(u=>u.id===id); }
function myAttempts(){ return (DB.attempts||[]).filter(a=>a.userId===SESSION); }
function contestAttemptsOf(uid){ return (DB.cAttempts||[]).filter(a=>a.userId===uid); }

/* persist extra DB collections */
function dbArr(key){ if(!DB[key]) DB[key]=[]; return DB[key]; }
