/* =====================================================================
   VARTALAB — storage layer (localStorage + in-memory fallback)
   (extracted from the original single-file index.html; classic script,
    shares the global scope — files are loaded in numeric order)
   ===================================================================== */
/* ============ STORAGE ============ */
const _mem = {}; // in-memory fallback so the app also runs where localStorage is blocked (e.g. sandboxed previews)
const store = {
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):(k in _mem?_mem[k]:d);}catch(e){return (k in _mem?_mem[k]:d);}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} _mem[k]=v;},
  del(k){try{localStorage.removeItem(k);}catch(e){} delete _mem[k];}
};
