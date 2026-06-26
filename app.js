// ===== DATA =====
const PHASES = ['Fase de Grupos','Octavos de Final','Cuartos de Final','Semifinales','Final'];
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const ADMIN_RESULT_DEFAULTS = {
  exact: 7,
  winnerNoGoals: 2,
  winnerAndOneTeamGoals: 4,
  oneTeamGoalsNoExact: 1
};

const ADMIN_EMAIL = 'a24gabrieldg@iesantonlosada.gal';
// Nota: las reglas Firestore deben permitir escrituras a Admin Total.
// En app.js solo podemos identificar al admin por email; Firestore rules deben implementar la misma lógica.


const getFB = () => window.__FIREBASE__ || {};
const fbAuth = () => getFB().auth;
const fbDb = () => getFB().db;
const fbStorage = () => getFB().storage;

const GROUP_TEAMS = {
  A:[{f:'🇲🇽',n:'México'},{f:'🇿🇦',n:'Sudáfrica'},{f:'🇰🇷',n:'Corea del Sur'},{f:'🇨🇿',n:'República Checa'}],
  B:[{f:'🇨🇦',n:'Canadá'},{f:'🇧🇦',n:'Bosnia y Herzegovina'},{f:'🇶🇦',n:'Qatar'},{f:'🇨🇭',n:'Suiza'}],
  C:[{f:'🇧🇷',n:'Brasil'},{f:'🇲🇦',n:'Marruecos'},{f:'🇭🇹',n:'Haití'},{f:'🏴',n:'Escocia'}],
  D:[{f:'🇺🇸',n:'Estados Unidos'},{f:'🇵🇾',n:'Paraguay'},{f:'🇦🇺',n:'Australia'},{f:'🇹🇷',n:'Turquía'}],
  E:[{f:'🇩🇪',n:'Alemania'},{f:'🇨🇼',n:'Curazao'},{f:'🇨🇮',n:'Costa de Marfil'},{f:'🇪🇨',n:'Ecuador'}],
  F:[{f:'🇳🇱',n:'Países Bajos'},{f:'🇯🇵',n:'Japón'},{f:'🇸🇪',n:'Suecia'},{f:'🇹🇳',n:'Túnez'}],
  G:[{f:'🇧🇪',n:'Bélgica'},{f:'🇪🇬',n:'Egipto'},{f:'🇮🇷',n:'Irán'},{f:'🇳🇿',n:'Nueva Zelanda'}],
  H:[{f:'🇪🇸',n:'España'},{f:'🇨🇻',n:'Cabo Verde'},{f:'🇸🇦',n:'Arabia Saudí'},{f:'🇺🇾',n:'Uruguay'}],
  I:[{f:'🇫🇷',n:'Francia'},{f:'🇸🇳',n:'Senegal'},{f:'🇮🇶',n:'Irak'},{f:'🇳🇴',n:'Noruega'}],
  J:[{f:'🇦🇷',n:'Argentina'},{f:'🇩🇿',n:'Argelia'},{f:'🇦🇹',n:'Austria'},{f:'🇯🇴',n:'Jordania'}],
  K:[{f:'🇵🇹',n:'Portugal'},{f:'🇨🇩',n:'R.D. Congo'},{f:'🇺🇿',n:'Uzbekistán'},{f:'🇨🇴',n:'Colombia'}],
  L:[{f:'🏴',n:'Inglaterra'},{f:'🇭🇷',n:'Croacia'},{f:'🇬🇭',n:'Ghana'},{f:'🇵🇦',n:'Panamá'}]
};

// Lista plana de todos los equipos del torneo (para desplegables admin)
const ALL_TEAMS = Object.values(GROUP_TEAMS).flat().reduce((acc, t) => {
  if(!acc.find(x => x.n === t.n)) acc.push(t);
  return acc;
}, []).sort((a, b) => a.n.localeCompare(b.n, 'es'));

// Generate group matches
// Fechas y horas en hora España peninsular (CEST, UTC+2)
function makeGroupMatches(){
  const base = {
    //           J1-P1                  J1-P2                  J2-P1                  J2-P2                  J3-P1                  J3-P2
    A:[['2026-06-11','21:00'],['2026-06-12','04:00'],['2026-06-18','18:00'],['2026-06-19','03:00'],['2026-06-25','03:00'],['2026-06-25','03:00']],
    B:[['2026-06-12','21:00'],['2026-06-13','21:00'],['2026-06-18','21:00'],['2026-06-19','00:00'],['2026-06-24','21:00'],['2026-06-24','21:00']],
    C:[['2026-06-14','00:00'],['2026-06-14','03:00'],['2026-06-20','00:00'],['2026-06-20','03:00'],['2026-06-25','00:00'],['2026-06-25','00:00']],
    D:[['2026-06-13','03:00'],['2026-06-13','06:00'],['2026-06-19','21:00'],['2026-06-19','06:00'],['2026-06-26','04:00'],['2026-06-26','04:00']],
    E:[['2026-06-14','19:00'],['2026-06-15','01:00'],['2026-06-21','00:00'],['2026-06-21','02:00'],['2026-06-26','00:00'],['2026-06-26','00:00']],
    F:[['2026-06-15','00:00'],['2026-06-15','04:00'],['2026-06-20','19:00'],['2026-06-20','06:00'],['2026-06-26','01:00'],['2026-06-26','01:00']],
    G:[['2026-06-15','21:00'],['2026-06-16','03:00'],['2026-06-22','01:00'],['2026-06-22','03:00'],['2026-06-27','05:00'],['2026-06-27','05:00']],
    H:[['2026-06-15','18:00'],['2026-06-16','00:00'],['2026-06-21','18:00'],['2026-06-22','00:00'],['2026-06-27','02:00'],['2026-06-27','02:00']],
    I:[['2026-06-16','21:00'],['2026-06-17','00:00'],['2026-06-22','23:00'],['2026-06-23','02:00'],['2026-06-26','21:00'],['2026-06-26','21:00']],
    J:[['2026-06-17','03:00'],['2026-06-17','06:00'],['2026-06-22','19:00'],['2026-06-23','05:00'],['2026-06-28','04:00'],['2026-06-28','04:00']],
    K:[['2026-06-17','19:00'],['2026-06-18','04:00'],['2026-06-23','19:00'],['2026-06-24','04:00'],['2026-06-28','01:30'],['2026-06-28','01:30']],
    L:[['2026-06-17','22:00'],['2026-06-18','01:00'],['2026-06-23','22:00'],['2026-06-24','01:00'],['2026-06-27','23:00'],['2026-06-27','23:00']]
  };
  const pairs = [[0,1],[2,3],[0,2],[1,3],[3,0],[1,2]];
  const res = {};
  GROUPS.forEach(g=>{
    const ts = GROUP_TEAMS[g];
    res[g] = pairs.map((p,i)=>({
      id:`${g}${i+1}`,
      t1:ts[p[0]].f, n1:ts[p[0]].n,
      t2:ts[p[1]].f, n2:ts[p[1]].n,
      date:base[g][i][0], time:base[g][i][1]
    }));
  });
  return res;
}

const MATCHES_GROUP = makeGroupMatches();

const KNOCKOUT_TEMPLATES = {
  1: Array.from({length:16},(_,i)=>({id:`R16_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-06-29',time:'18:00',locked:true})),
  2: Array.from({length:8},(_,i)=>({id:`QF_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-04',time:'18:00',locked:true})),
  3: Array.from({length:4},(_,i)=>({id:`SF_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-14',time:'18:00',locked:true})),
  4: [{id:'FIN_1',n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-19',time:'18:00',locked:true}]
};

function storageKey_(uid, key){
  return uid ? `wf26_${key}__${uid}` : `wf26_${key}__anon`;
}

function loadStateForUser_(uid){
  return {
    users: JSON.parse(localStorage.getItem(storageKey_(uid,'users'))||'{}'),
    leagues: JSON.parse(localStorage.getItem(storageKey_(uid,'leagues'))||'{}'),
    predictions: JSON.parse(localStorage.getItem(storageKey_(uid,'preds'))||'{}'),
    knockoutMatches: JSON.parse(localStorage.getItem(storageKey_(uid,'ko'))||'{}'),
  };
}

let S = {
  ...loadStateForUser_(localStorage.getItem('wf26_cu')||null),
  // cache resultados/schedule compartidos entre usuarios
  results: JSON.parse(localStorage.getItem('wf26_results')||'{}'),
  schedule: JSON.parse(localStorage.getItem('wf26_sched')||'{}'),
  // resultados forzados por admin: cache permanente, nunca machacado por polling
  adminResults: JSON.parse(localStorage.getItem('wf26_admin_results')||'{}'),
  // partidos vetados por admin (borrados manualmente): la API no puede sobreescribirlos
  vetoed: JSON.parse(localStorage.getItem('wf26_vetoed')||'{}'),
  // lock manual por admin { [mid]: '0'|'1' } — prioridad sobre tiempo; sincronizado con Firestore
  lockOverrides: JSON.parse(localStorage.getItem('wf26_lock_overrides')||'{}'),
  // partidos con equipos intercambiados por admin { [mid]: true }
  swappedMatches: JSON.parse(localStorage.getItem('wf26_swapped')||'{}'),
  // fecha/hora forzadas por admin (prioridad sobre la API): { [mid]: {date,time} }
  scheduleOverrides: JSON.parse(localStorage.getItem('wf26_sched_overrides')||'{}'),
  // emparejamientos de fases knockout definidos por admin (globales, no por liga): { [phase]: [matches] }
  knockoutOverrides: JSON.parse(localStorage.getItem('wf26_ko_overrides')||'{}'),
  currentUser: localStorage.getItem('wf26_cu')||null,
  currentPhase: 0,
  currentGroup: 'A',
  currentLeague: null,
  predViewMode: localStorage.getItem('wf26_pred_view')||'group', // 'group' | 'date'
  currentDateTab: null, // fecha seleccionada (YYYY-MM-DD) en modo "Por fecha"
  rankingViewMode: localStorage.getItem('wf26_ranking_view')||'liga', // 'liga' | 'grupos'
  currentStandingsGroup: 'A' // grupo (o 'BEST3') seleccionado en la Clasificación de grupos
};

// Si cambias de usuario sin recargar, fuerza recargar estado del nuevo UID
function reloadStateForCurrentUser(){
  const uid = localStorage.getItem('wf26_cu') || null;
  S.currentUser = uid;
  const loaded = loadStateForUser_(uid);
  S.users = loaded.users || {};
  S.leagues = loaded.leagues || {};
  S.predictions = loaded.predictions || {};
  S.knockoutMatches = loaded.knockoutMatches || {};
}

async function refreshUserLeagues(){
  try{
    const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const all = await getDocs(collection(fbDb(), 'leagues'));
    const owned=[];
    all.forEach(d=>{
      const data=d.data()||{};
      const mem=data.members||[];
      if(mem.includes(S.currentUser)) owned.push(d.id);
    });
    S.leagues = S.leagues || {};
    owned.forEach(code=>{
      const data = all.docs.find(x=>x.id===code)?.data() || {};
      S.leagues[code] = data;
      S.leagues[code].code = code;
    });
  }catch(e){
    console.error('refreshUserLeagues error', e);
  }
}

function save(){
  if(!S.currentUser) return;
  localStorage.setItem(storageKey_(S.currentUser,'users'),JSON.stringify(S.users));
  localStorage.setItem(storageKey_(S.currentUser,'leagues'),JSON.stringify(S.leagues));
  localStorage.setItem(storageKey_(S.currentUser,'preds'),JSON.stringify(S.predictions||{}));
  localStorage.setItem(storageKey_(S.currentUser,'ko'),JSON.stringify(S.knockoutMatches||{}));

  // limpiar cache vieja no-separada (por si venías usando el bug anterior)
  localStorage.removeItem('wf26_users');
  localStorage.removeItem('wf26_leagues');
  localStorage.removeItem('wf26_preds');
  localStorage.removeItem('wf26_ko');

  // resultados/schedule compartidos (no dependen del usuario)
  localStorage.setItem('wf26_results',JSON.stringify(S.results||{}));
  localStorage.setItem('wf26_sched',JSON.stringify(S.schedule||{}));
  localStorage.setItem('wf26_admin_results',JSON.stringify(S.adminResults||{}));
  localStorage.setItem('wf26_vetoed',JSON.stringify(S.vetoed||{}));
  localStorage.setItem('wf26_lock_overrides',JSON.stringify(S.lockOverrides||{}));
  if(S.predViewMode) localStorage.setItem('wf26_pred_view', S.predViewMode);
  localStorage.setItem('wf26_swapped',JSON.stringify(S.swappedMatches||{}));
  localStorage.setItem('wf26_sched_overrides',JSON.stringify(S.scheduleOverrides||{}));
  localStorage.setItem('wf26_ko_overrides',JSON.stringify(S.knockoutOverrides||{}));
}

const getCurrentUserEmail = () => {
  try { return (S.users?.[S.currentUser]?.username || '').trim(); } catch { return ''; }
};
const isTotalAdmin = () => {
  const email = getCurrentUserEmail();
  return email && String(email).toLowerCase() === String(ADMIN_EMAIL).toLowerCase();
};
const isLeagueAdminForCurrentLeague = () => {
  try {
    if (!S.currentLeague) return false;
    const l = S.leagues?.[S.currentLeague];
    if (!l) return false;
    return String(l.creatorUid) === String(S.currentUser);
  } catch { return false; }
};

// ===== AUTH =====
function switchAuthTab(t){
  try{
    document.querySelectorAll('.auth-tab').forEach((el,i)=>el.classList.toggle('active',i===(t==='login'?0:1)));
    const lf=document.getElementById('login-form');
    const rf=document.getElementById('register-form');
    if(lf) lf.style.display=t==='login'?'block':'none';
    if(rf) rf.style.display=t==='register'?'block':'none';
    document.getElementById('login-err').textContent='';
    document.getElementById('reg-err').textContent='';
  }catch(e){ console.error('switchAuthTab error',e); }
}

async function doLogin(){
  try{
    const email=document.getElementById('login-email').value.trim();
    const pass=document.getElementById('login-pass').value;
    const errEl=document.getElementById('login-err');
    if(!email||!pass){ errEl.textContent='Completa email y contraseña'; return; }

    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    const res = await signInWithEmailAndPassword(fbAuth(), email, pass);
    const uid = res.user.uid;
    S.currentUser = uid;
    localStorage.setItem('wf26_cu', uid);

    // Recargar estado local del usuario y sincronizar sus ligas desde Firestore
    reloadStateForCurrentUser();
    await refreshUserLeagues();

    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const snap = await getDoc(doc(fbDb(), 'users', uid));
    S.users = S.users || {};
    if(snap.exists()){
      const d = snap.data()||{};
      S.users[uid] = { username: d.username||'', firstName: (d.firstName||'').trim(), avatar: d.avatarUrl||null };
    } else {
      S.users[uid] = { username: email, firstName: '', avatar: null };
    }

    // Importante: cargar predicciones guardadas en Firestore para que persistan tras cerrar sesión
    await loadPredictionsFromFirestoreForCurrentUser();

    showMain();
  }catch(e){
    console.error('doLogin error', e);
    document.getElementById('login-err').textContent = 'Error al iniciar sesión: ' + (e?.message||String(e));
  }
}

async function doRegister(){
  try{
    const firstName=document.getElementById('reg-firstname').value.trim();
    const email=document.getElementById('reg-email').value.trim();
    const pass=document.getElementById('reg-pass').value;
    const err=document.getElementById('reg-err');

    if(!firstName){ err.textContent='Pon tu nombre'; return; }
    if(!email||!pass){ err.textContent='Completa email y contraseña'; return; }
    if(pass.length<4){ err.textContent='Mínimo 4 caracteres'; return; }
    if(!fbAuth()||!fbDb()){ err.textContent='Firebase no está inicializado'; return; }

    const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    const res = await createUserWithEmailAndPassword(fbAuth(), email, pass);
    const uid = res.user.uid;

    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    await setDoc(doc(fbDb(), 'users', uid), {
      username: email,
      firstName,
      avatarUrl: null,
      createdAt: Date.now()
    }, { merge: true });

    S.currentUser = uid;
    localStorage.setItem('wf26_cu', uid);
    S.users = S.users || {};
    S.users[uid] = { username: email, firstName, avatar: null };

    showMain();
  }catch(e){
    console.error('doRegister error', e);
    document.getElementById('reg-err').textContent = 'Error al crear cuenta: ' + (e?.message||String(e));
  }
}

async function doLogout(){
  try{
    const { signOut } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    if(fbAuth()) await signOut(fbAuth());
  }finally{
    S.currentUser=null;
    localStorage.removeItem('wf26_cu');
    // no tocar otros caches compartidos; solo ocultar UI
    S.leagues = {};
    S.users = {};
    S.predictions = {};
    S.knockoutMatches = {};
    S.currentLeague = null;
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('active');
    switchAuthTab('login');
    document.getElementById('login-email').value='';
    document.getElementById('login-pass').value='';
  }
}

const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFtr_v_UbmNoS-7vtlaqFz2ObHyYFmMBXK6WGH2fygBkGeu8ywgbIJ0slk9EaVEs9Xfg/exec';
let autoResultsTimer = null;

async function fetchResultsFromSheet(){
  try{
    const r = await fetch(RESULTS_ENDPOINT, { cache: 'no-store' });
    const data = await r.json();
    const resultsMap = data?.results || {};
    const nextResults = {};
    Object.keys(resultsMap).forEach(mid=>{
      const it = resultsMap[mid] || {};
      const g1 = it.g1, g2 = it.g2;
      if(g1===null||g1===undefined||g2===null||g2===undefined) return;
      nextResults[mid] = { g1: Number(g1), g2: Number(g2) };
    });
    return { results: nextResults, schedule: data?.schedule || {} };
  }catch(e){
    console.error('fetchResultsFromSheet error', e);
    return null;
  }
}

// Carga resultados forzados y vetos del admin desde tournament/results (global, igual para todas las ligas).
async function fetchAdminResultsFromFirestore(){
  try{
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const snap = await getDoc(doc(fbDb(), 'tournament', 'results'));
    const data = snap.exists() ? (snap.data()||{}) : {};
    const freshResults = {};
    const freshVetoed = {};
    Object.entries(data).forEach(([mid, val])=>{
      if(val && val.vetoed === true) freshVetoed[mid] = true;
      else if(val) freshResults[mid] = val;
    });
    const merged = { ...(S.adminResults||{}), ...freshResults };
    Object.keys(freshVetoed).forEach(mid => delete merged[mid]);
    S.adminResults = merged;
    S.vetoed = { ...(S.vetoed||{}), ...freshVetoed };
    localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults));
    localStorage.setItem('wf26_vetoed', JSON.stringify(S.vetoed));
    return S.adminResults;
  }catch(e){
    console.error('fetchAdminResultsFromFirestore error', e);
    return S.adminResults || {};
  }
}

// Carga overrides globales del torneo (fecha/hora forzada y cruces de knockout) desde Firestore.
async function fetchTournamentOverrides(){
  try{
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const [schedSnap, koSnap, lockSnap, swapSnap] = await Promise.all([
      getDoc(doc(fbDb(), 'tournament', 'schedule_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'knockout_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'lock_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'swapped_matches'))
    ]);
    S.scheduleOverrides = schedSnap.exists() ? (schedSnap.data()||{}) : (S.scheduleOverrides||{});
    S.knockoutOverrides = koSnap.exists() ? (koSnap.data()||{}) : (S.knockoutOverrides||{});
    S.lockOverrides = lockSnap.exists() ? (lockSnap.data()||{}) : (S.lockOverrides||{});
    S.swappedMatches = swapSnap.exists() ? (swapSnap.data()||{}) : (S.swappedMatches||{});
    localStorage.setItem('wf26_sched_overrides', JSON.stringify(S.scheduleOverrides));
    localStorage.setItem('wf26_ko_overrides', JSON.stringify(S.knockoutOverrides));
    localStorage.setItem('wf26_lock_overrides', JSON.stringify(S.lockOverrides));
    localStorage.setItem('wf26_swapped', JSON.stringify(S.swappedMatches));
  }catch(e){
    console.error('fetchTournamentOverrides error', e);
  }
}

// Admin: forzar fecha/hora de un partido (prioridad sobre la API externa)
async function adminSetSchedule(mid){
  if(!isTotalAdmin()) return;
  const dateVal = document.getElementById('adm-date-'+mid)?.value;
  const timeVal = document.getElementById('adm-time-'+mid)?.value;
  if(!dateVal || !timeVal){ alert('Indica fecha y hora'); return; }
  try{
    const { doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'schedule_overrides');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const next = { ...existing, [mid]: { date: dateVal, time: timeVal } };
    await setDoc(ref, next, { merge: false });
    S.scheduleOverrides = next;
    localStorage.setItem('wf26_sched_overrides', JSON.stringify(next));
    if(!S.schedule) S.schedule = {};
    S.schedule[mid] = { date: dateVal, time: timeVal };
    save();
    renderPhaseBody();
    const ind = document.getElementById('save-ind');
    if(ind){ ind.textContent='✅ Horario actualizado'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
  }catch(e){ console.error('adminSetSchedule error', e); alert('Error: '+(e?.message||String(e))); }
}

// Admin: definir los dos equipos de un partido de fase eliminatoria (cruces)
async function adminSetKnockoutTeams(phase, mid){
  if(!isTotalAdmin()) return;
  const n1 = document.getElementById('adm-ko-sel1-'+mid)?.value?.trim();
  const n2 = document.getElementById('adm-ko-sel2-'+mid)?.value?.trim();
  if(!n1 || !n2){ alert('Selecciona ambos equipos'); return; }
  const team1 = ALL_TEAMS.find(t => t.n === n1);
  const team2 = ALL_TEAMS.find(t => t.n === n2);
  const t1 = team1?.f || '🏳️';
  const t2 = team2?.f || '🏳️';
  try{
    const { doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'knockout_overrides');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const phaseMatches = existing[phase] || KNOCKOUT_TEMPLATES[phase].map(m=>({...m}));
    const idx = phaseMatches.findIndex(m=>m.id===mid);
    const base = idx>-1 ? phaseMatches[idx] : KNOCKOUT_TEMPLATES[phase].find(m=>m.id===mid);
    const updatedMatch = { ...base, n1, n2, t1, t2 };
    const updatedPhase = idx>-1 ? phaseMatches.map((m,i)=>i===idx?updatedMatch:m) : [...phaseMatches, updatedMatch];
    const next = { ...existing, [phase]: updatedPhase };
    await setDoc(ref, next, { merge: false });
    S.knockoutOverrides = next;
    S.knockoutMatches[phase] = updatedPhase;
    localStorage.setItem('wf26_ko_overrides', JSON.stringify(next));

    // Auto-abrir el partido si ambos equipos están definidos
    if(n1 && n2){
      const lockRef = doc(fbDb(), 'tournament', 'lock_overrides');
      const lockSnap = await getDoc(lockRef);
      const lockExisting = lockSnap.exists() ? (lockSnap.data()||{}) : {};
      // Solo abrir si no hay un lock manual previo
      if(lockExisting[mid] !== '1'){
        const lockNext = { ...lockExisting, [mid]: '0' };
        await setDoc(lockRef, lockNext, { merge: false });
        S.lockOverrides = lockNext;
        localStorage.setItem('wf26_lock_overrides', JSON.stringify(lockNext));
      }
    }

    save();
    renderPhaseBody();
    const ind = document.getElementById('save-ind');
    if(ind){ ind.textContent='✅ Cruce actualizado'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
  }catch(e){ console.error('adminSetKnockoutTeams error', e); alert('Error: '+(e?.message||String(e))); }
}

const _unsubTournament = {};

function startRealtimeTournament(){
  // Cancela listeners previos
  Object.values(_unsubTournament).forEach(u => { try{ u(); }catch(e){} });

  import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js').then(({ doc, onSnapshot })=>{

    // 1) Resultados admin
    _unsubTournament.results = onSnapshot(
      doc(fbDb(), 'tournament', 'results'),
      (snap) => {
        const data = snap.exists() ? (snap.data()||{}) : {};
        const freshResults = {};
        const freshVetoed = {};
        Object.entries(data).forEach(([mid, val])=>{
          if(val && val.vetoed === true) freshVetoed[mid] = true;
          else if(val) freshResults[mid] = val;
        });
        const merged = { ...(S.adminResults||{}), ...freshResults };
        Object.keys(freshVetoed).forEach(mid => delete merged[mid]);
        S.adminResults = merged;
        S.vetoed = { ...(S.vetoed||{}), ...freshVetoed };
        localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults));
        localStorage.setItem('wf26_vetoed', JSON.stringify(S.vetoed));
        const apiBase = {};
        Object.entries(S.results||{}).forEach(([mid, v])=>{
          if(!S.adminResults[mid] && !S.vetoed[mid]) apiBase[mid] = v;
        });
        S.results = { ...apiBase, ...S.adminResults };
        save(); renderPhaseBody(); renderPredTab(); renderRanking();
      },
      (err) => console.error('onSnapshot results error', err)
    );

    // 2) Lock overrides
    _unsubTournament.locks = onSnapshot(
      doc(fbDb(), 'tournament', 'lock_overrides'),
      (snap) => {
        S.lockOverrides = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_lock_overrides', JSON.stringify(S.lockOverrides));
        save(); renderPhaseBody();
      },
      (err) => console.error('onSnapshot lock_overrides error', err)
    );

    // 3) Schedule overrides
    _unsubTournament.schedule = onSnapshot(
      doc(fbDb(), 'tournament', 'schedule_overrides'),
      (snap) => {
        S.scheduleOverrides = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_sched_overrides', JSON.stringify(S.scheduleOverrides));
        // Merge con el schedule de la API
        const apiSched = JSON.parse(localStorage.getItem('wf26_sched')||'{}');
        S.schedule = { ...apiSched, ...S.scheduleOverrides };
        save(); renderPhaseBody();
      },
      (err) => console.error('onSnapshot schedule_overrides error', err)
    );

    // 4) Knockout overrides
    _unsubTournament.knockout = onSnapshot(
      doc(fbDb(), 'tournament', 'knockout_overrides'),
      (snap) => {
        S.knockoutOverrides = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_ko_overrides', JSON.stringify(S.knockoutOverrides));
        Object.keys(S.knockoutOverrides).forEach(phase => {
          S.knockoutMatches[phase] = S.knockoutOverrides[phase];
        });
        save(); renderPhaseBody();
      },
      (err) => console.error('onSnapshot knockout_overrides error', err)
    );

    // 5) Swapped matches
    _unsubTournament.swapped = onSnapshot(
      doc(fbDb(), 'tournament', 'swapped_matches'),
      (snap) => {
        S.swappedMatches = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_swapped', JSON.stringify(S.swappedMatches));
        save(); renderPhaseBody(); renderPredTab();
      },
      (err) => console.error('onSnapshot swapped_matches error', err)
    );

  }).catch(e => console.error('startRealtimeTournament import error', e));
}

async function startAutoUpdateResults(){
  console.log('[wf26] startAutoUpdateResults');
  if(autoResultsTimer) clearInterval(autoResultsTimer);

  // Carga inicial: API + Firestore en paralelo
  const [first] = await Promise.all([fetchResultsFromSheet(), fetchAdminResultsFromFirestore(), fetchTournamentOverrides()]);
  if(first){
    // El schedule de la API es la base; los overrides de admin tienen prioridad
    S.schedule = { ...(first.schedule||{}), ...(S.scheduleOverrides||{}) };
    // adminResults ya actualizó S.adminResults internamente
    // Filtrar de la API los partidos vetados antes del merge inicial
    const initApiResults = first.results || {};
    Object.keys(S.vetoed||{}).forEach(mid => delete initApiResults[mid]);
    S.results = { ...initApiResults, ...(S.adminResults||{}) };
    // Aplicar cruces de knockout definidos por admin
    Object.keys(S.knockoutOverrides||{}).forEach(phase=>{
      S.knockoutMatches[phase] = S.knockoutOverrides[phase];
    });
    save();
    renderPredTab();
    renderRanking();
    renderPhaseBody();
  }

  // Listener en tiempo real para resultados admin — actualiza inmediatamente sin esperar polling
  startRealtimeTournament();

  autoResultsTimer = setInterval(async ()=>{
    // Esperar API y Firestore juntos para que el merge siempre use datos frescos
    const [next] = await Promise.all([
      fetchResultsFromSheet(),
      fetchAdminResultsFromFirestore(),
      fetchTournamentOverrides()
    ]);
    if(!next) return;
    // Filtrar de la API los partidos vetados por admin antes del merge
    const apiResults = next.results || {};
    Object.keys(S.vetoed||{}).forEach(mid => delete apiResults[mid]);
    const nextResults = { ...apiResults, ...(S.adminResults||{}) };
    // El schedule forzado por admin tiene prioridad sobre el de la API
    const nextSchedule = { ...(next.schedule||{}), ...(S.scheduleOverrides||{}) };
    const prev = S.results || {};
    const changed = Object.keys(nextResults).some(mid=>{
      const a=nextResults[mid]||{}, b=prev[mid]||{};
      return Number(a.g1)!==Number(b.g1)||Number(a.g2)!==Number(b.g2);
    }) || Object.keys(nextResults).length !== Object.keys(prev).length;
    const prevSched = S.schedule || {};
    const schedChanged = Object.keys(nextSchedule).some(mid=>{
      const a=nextSchedule[mid]||{}, b=prevSched[mid]||{};
      return a.date!==b.date||a.time!==b.time;
    }) || Object.keys(prevSched).length !== Object.keys(nextSchedule).length;
    if(!changed && !schedChanged) return;
    S.results = nextResults;
    S.schedule = nextSchedule;
    Object.keys(S.knockoutOverrides||{}).forEach(phase=>{
      S.knockoutMatches[phase] = S.knockoutOverrides[phase];
    });
    Object.keys(S.predictions||{}).forEach(leagueCode=>{
      Object.keys(S.predictions[leagueCode]||{}).forEach(uid=>{
        if(uid !== S.currentUser) delete S.predictions[leagueCode][uid];
      });
    });
    save();
    renderPhaseBody();
    renderPredTab();
    renderRanking();
  }, 15000);
}

function showMain(){
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('main-screen').classList.add('active');
  document.getElementById('top-bar-right').innerHTML = isTotalAdmin()?'<span class="admin-badge">ADMIN</span>':'';
  goTab('ligas',0);
  renderProfileInfo();
  startAutoUpdateResults();
}

// ===== NAV =====
function goTab(name,idx){
  document.querySelectorAll('.tab-page').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.getElementById('nav-'+idx).classList.add('active');
  const titles=['Mis Ligas','Predicciones','Clasificación','Información'];
  document.getElementById('top-bar-title').textContent=titles[idx];
  if(name==='ligas') renderLeagues();
  if(name==='preds') renderPredTab();
  if(name==='tabla') renderRanking();
  if(name==='info') renderProfileInfo();
}

// ===== LIGAS =====
let pendingAvatar=null;
function generateCode(){
  const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code='';for(let i=0;i<6;i++) code+=c[Math.floor(Math.random()*c.length)];
  return S.leagues[code]?generateCode():code;
}
function openModal(type, extra){
  pendingAvatar=null;
  document.getElementById('modal-overlay').style.display='flex';
  const mc=document.getElementById('modal-content');
  if(type==='create-league'){
    mc.innerHTML=`<div class="modal-title">🏆 Crear liga</div>
    <div class="avatar-upload" id="lav-up">
      <span style="font-size:26px;color:var(--text3)">📷</span>
      <span style="font-size:10px;color:var(--text3);margin-top:3px">Foto liga</span>
      <input type="file" accept="image/*" onchange="handleLeagueAvatar(this)">
      <img id="lav-prev" style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%">
    </div>
    <div class="modal-field"><label>Nombre de la liga</label><input type="text" id="lname-inp" placeholder="Ej: Los Cracks"></div>
    <div class="modal-btns"><button class="btn-cancel" onclick="closeModal()">Cancelar</button><button class="btn-confirm" onclick="createLeague()">Crear</button></div>
    <div class="msg-err" id="create-err"></div>`;
  } else if(type==='join-league'){
    mc.innerHTML=`<div class="modal-title">🔑 Unirse a una liga</div>
    <div class="modal-field"><label>Código de la liga</label><input type="text" id="jcode-inp" placeholder="ABC123" style="text-transform:uppercase;letter-spacing:3px;font-size:18px;text-align:center"></div>
    <div class="modal-btns"><button class="btn-cancel" onclick="closeModal()">Cancelar</button><button class="btn-confirm" onclick="joinLeague()">Unirse</button></div>
    <div class="msg-err" id="join-err"></div>`;
  } else if(type==='pick-league'){
    const ul=S.users[S.currentUser]?.leagues||[];
    if(!ul.length){mc.innerHTML=`<div class="modal-title">Sin ligas</div><p style="color:var(--text2);font-size:13px;margin-bottom:16px">Primero crea o únete a una liga.</p><button class="btn-primary" onclick="closeModal();goTab('ligas',0)">Ir a ligas</button>`;return;}
    mc.innerHTML=`<div class="modal-title">⚽ Selecciona una liga</div>`+ul.filter(c=>S.leagues[c]).map(c=>{
      const l=S.leagues[c];
      let av=l.avatar?`<img src="${l.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span style="font-size:16px">🏆</span>`;
      return `<div class="league-pick-item" onclick="pickLeagueForPreds('${c}')"><div class="league-pick-avatar">${av}</div><div><div style="font-size:13px;font-weight:600">${l.name}</div><div style="font-size:11px;color:var(--text2)">${l.members.length} miembros</div></div></div>`;
    }).join('');
  }
}
function handleLeagueAvatar(input){
  if(!input.files[0]) return;
  const r=new FileReader(); r.onload=e=>{pendingAvatar=e.target.result;const p=document.getElementById('lav-prev');p.src=e.target.result;p.style.display='block';document.querySelectorAll('#lav-up > span').forEach(s=>s.style.display='none');}; r.readAsDataURL(input.files[0]);
}
async function createLeague(){
  const name=document.getElementById('lname-inp').value.trim();
  if(!name){document.getElementById('create-err').textContent='Pon un nombre';return;}
  const code=generateCode();
  try{
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    await setDoc(doc(fbDb(), 'leagues', code), {
      name, avatar: pendingAvatar||null, code,
      members: [S.currentUser], creatorUid: S.currentUser, createdAt: Date.now()
    }, { merge: false });
    S.currentLeague = code;
    S.leagues = S.leagues || {};
    S.leagues[code] = { name, avatar: pendingAvatar||null, code, members: [S.currentUser], creatorUid: S.currentUser, createdAt: Date.now() };
    document.getElementById('modal-content').innerHTML=`<div class="modal-title">✅ Liga creada</div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:14px">Comparte este código con tus amigos:</p>
    <div class="code-display"><div class="code-text">${code}</div><div class="code-label">Código único de la liga</div></div>
    <button class="btn-copy" onclick="copyCode('${code}')">📋 Copiar código</button>
    <div class="msg-ok" id="copy-ok"></div>
    <button class="btn-primary" style="margin-top:14px" onclick="closeModal();renderLeagues()">Continuar</button>`;
  }catch(e){
    console.error('createLeague error', e);
    document.getElementById('create-err').textContent='Error al crear liga: '+(e?.message||String(e));
  }
}
function copyCode(code){ navigator.clipboard.writeText(code).then(()=>{document.getElementById('copy-ok').textContent='¡Copiado!';}).catch(()=>{document.getElementById('copy-ok').textContent='Código: '+code;}); }
async function joinLeague(){
  const code=document.getElementById('jcode-inp').value.trim().toUpperCase();
  const err=document.getElementById('join-err');
  if(!code){err.textContent='Introduce el código';return;}
  try{
    const { doc, getDoc, updateDoc, arrayUnion } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const snap = await getDoc(doc(fbDb(), 'leagues', code));
    if(!snap.exists()){ err.textContent='❌ Liga no encontrada. Code usado: '+code; return; }
    const l = snap.data();
    await updateDoc(doc(fbDb(), 'leagues', code), { members: arrayUnion(S.currentUser) });
    await updateDoc(doc(fbDb(), 'users', S.currentUser), { leagues: arrayUnion(code) });
    S.currentLeague = code;
    await refreshUserLeagues();
    document.getElementById('modal-content').innerHTML=`<div class="modal-title">🎉 ¡Bienvenido!</div><p style="font-size:13px;color:var(--text2);margin-bottom:16px">Ahora eres miembro de <strong style="color:var(--text)">${l.name||'Liga'}</strong></p><button class="btn-primary" onclick="closeModal();renderLeagues()">Ver ligas</button>`;
  }catch(e){
    console.error('joinLeague error', e);
    err.textContent='Error al unirse: '+(e?.message||String(e));
  }
}
function closeModal(){ document.getElementById('modal-overlay').style.display='none'; pendingAvatar=null; }
function closeModalBg(e){ if(e.target===document.getElementById('modal-overlay')) closeModal(); }

function renderLeagues(){
  const list=document.getElementById('leagues-list'); if(!list) return;
  const leaguesCodes = Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  if(!leaguesCodes.length){
    const cached = JSON.parse(localStorage.getItem(storageKey_(S.currentUser,'leagues'))||'{}');
    const cachedCodes = Object.keys(cached||{}).filter(c=>cached[c]);
    if(cachedCodes.length){ S.leagues=cached; return renderLeagues(); }
    list.innerHTML=`<div class="empty-state"><div class="ei">🏆</div><p>Aún no tienes ligas.<br>¡Crea una o únete!</p></div>`; return;
  }

  list.innerHTML=leaguesCodes.map(code=>{
    const l=S.leagues[code];
    const pts=getUserPts(S.currentUser,code);
    let av=l.avatar?`<img src="${l.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span style="font-size:18px">🏆</span>`;
    const isSelected=S.currentLeague===code;
    const isCreator = String(l.creatorUid) === String(S.currentUser);

    const exitBtn = isCreator
      ? `<button class="btn-exit" onclick="confirmDeleteLeague('${code}');event.stopPropagation();">🗑️ Eliminar</button>`
      : `<button class="btn-exit" onclick="leaveLeague('${code}','leave');event.stopPropagation();">🚪 Salir</button>`;

    return `<div class="league-card${isSelected?' selected':''}" onclick="selectLeague('${code}')">
      <div class="league-avatar">${av}</div>
      <div class="league-info">
        <div class="league-name">${l.name}</div>
        <div class="league-meta">${l.members.length} miembros · ${code}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:20px;font-weight:700;color:var(--gold)">${pts}</div>
        <div style="font-size:10px;color:var(--text2)">pts</div>
        <div style="margin-top:10px;display:flex;justify-content:flex-end;">
          ${exitBtn}
        </div>
      </div>
    </div>`;
  }).join('');
}
function selectLeague(code){ S.currentLeague=code; renderLeagues(); }

function confirmDeleteLeague(code){
  const l = S.leagues[code];
  const name = l ? l.name : code;

  // Crear overlay propio para no interferir con el modal principal
  let ov = document.getElementById('delete-league-overlay');
  if(!ov){
    ov = document.createElement('div');
    ov.id = 'delete-league-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
    document.getElementById('app').appendChild(ov);
  }
  ov.style.display = 'flex';
  ov.innerHTML = '';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--bg2);border-radius:20px 20px 0 0;padding:24px 20px 32px;width:100%;max-width:390px;border-top:1px solid var(--border)';
  box.innerHTML = '<div style="width:36px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px"></div>';

  const title = document.createElement('div');
  title.style.cssText = 'font-size:18px;font-weight:800;color:#ef4444;margin-bottom:10px';
  title.textContent = '🗑️ Eliminar liga';
  box.appendChild(title);

  const msg = document.createElement('div');
  msg.style.cssText = 'font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:24px';
  msg.innerHTML = 'Estás a punto de eliminar <strong style="color:var(--text)">' + name + '</strong>.<br>Esta acción es <strong style="color:#ef4444">irreversible</strong>: se borrarán la liga y todos sus datos.';
  box.appendChild(msg);

  const btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:10px';

  const btnCancel = document.createElement('button');
  btnCancel.className = 'btn-secondary';
  btnCancel.style.cssText = 'flex:1;margin-top:0';
  btnCancel.textContent = 'Cancelar';
  btnCancel.onclick = () => { ov.style.display = 'none'; };

  const btnDelete = document.createElement('button');
  btnDelete.className = 'btn-danger';
  btnDelete.style.cssText = 'flex:1;margin-top:0';
  btnDelete.textContent = 'Eliminar';
  btnDelete.onclick = async () => {
    ov.style.display = 'none';
    await leaveLeague(code, 'delete');
  };

  btns.appendChild(btnCancel);
  btns.appendChild(btnDelete);
  box.appendChild(btns);
  ov.appendChild(box);

  // Cerrar al tocar fuera
  ov.onclick = (e) => { if(e.target === ov) ov.style.display = 'none'; };
}

async function doDeleteLeague(code){
  const input = document.getElementById('delete-confirm-code')?.value?.trim().toUpperCase();
  const err = document.getElementById('delete-confirm-err');
  if(input !== code.toUpperCase()){
    if(err) err.textContent = 'El código no coincide. Inténtalo de nuevo.';
    return;
  }
  closeModal();
  await leaveLeague(code, 'delete');
}

async function leaveLeague(code, mode){
  if(!S.currentUser) return;
  try{
    const { doc, getDoc, updateDoc, deleteDoc, arrayRemove, getFirestore } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    // Not all bundlers expose getFirestore; ignore if unused

    const leagueRef = doc(fbDb(), 'leagues', code);
    const snap = await getDoc(leagueRef);
    if(!snap.exists()){
      // fallback local
      delete S.leagues[code];
      if(S.currentLeague===code) S.currentLeague=null;
      save();
      renderLeagues();
      return;
    }

    const l = snap.data() || {};
    const isCreator = String(l.creatorUid) === String(S.currentUser);

    if(mode === 'delete' && isCreator){
      // borrar liga completa
      await deleteDoc(leagueRef);
      delete S.leagues[code];

      // limpiar tu estado local (predicciones/knockout en esa liga)
      if(S.predictions && S.predictions[code]) delete S.predictions[code];
      if(S.knockoutMatches) delete S.knockoutMatches[code];

      if(S.currentLeague===code) S.currentLeague=null;
      save();
      // redibujar
      renderLeagues();
      renderPredTab();
      renderRanking();
      return;
    }

    // salir normal: quitarte del array members
    if(Array.isArray(l.members)){
      await updateDoc(leagueRef, { members: arrayRemove(S.currentUser) });
    }

    // quitar tu liga de tu array local en Firestore (por si lo usas en otras pantallas)
    await updateDoc(doc(fbDb(), 'users', S.currentUser), {
      leagues: arrayRemove(code)
    });

    // limpiar tu estado local
    delete S.leagues[code];
    if(S.currentLeague===code) S.currentLeague=null;

    if(S.predictions && S.predictions[code]) delete S.predictions[code];
    if(S.knockoutMatches) delete S.knockoutMatches[code];

    save();
    renderLeagues();
    renderPredTab();
    renderRanking();
  }catch(e){
    console.error('leaveLeague error', e);
    alert('No se pudo salir/eliminar la liga: ' + (e?.message||String(e)));
  }
}

// ===== PREDICCIONES =====
function pickLeagueForPreds(code){ S.currentLeague=code; closeModal(); renderPredTab(); }

async function renderPredTab(){
  const inner=document.getElementById('pred-inner');
  if(!inner){ console.error('renderPredTab: pred-inner missing'); return; }
  const ul=Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  if(!ul.length){ inner.innerHTML=`<div class="no-league-banner">Únete o crea una <span>liga</span> para hacer predicciones</div>`; return; }
  if(!S.currentLeague||!S.leagues[S.currentLeague]){
    inner.innerHTML=`<div style="padding:0 0 8px">
      <div style="padding:12px 14px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:12px;color:var(--text2)">Liga seleccionada:</span>
        <button class="league-sel-btn" onclick="openModal('pick-league')" style="max-width:200px"><span class="league-sel-name">Ninguna seleccionada</span> ▾</button>
      </div>
      <div class="pick-league-banner">🏆<br><br>Selecciona una liga para ver y hacer predicciones</div>
    </div>`;
    return;
  }
  const league=S.leagues[S.currentLeague];

  // Cargar predicciones de todos los miembros para poder mostrar preds rivales
  const memberUids = [...new Set([...(league.members||[]), S.currentUser])];
  await ensureLeaguePredictionsLoaded(S.currentLeague, memberUids);

  const isDateView = S.predViewMode === 'date';
  inner.innerHTML=`<div style="padding:0 0 0">
    <div style="padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:11px;color:var(--text2)">Liga:</span>
      <button class="league-sel-btn" onclick="openModal('pick-league')"><span class="league-sel-name">${league.name}</span> ▾</button>
    </div>
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border)">
      <button onclick="setPredViewMode('group')" style="flex:1;padding:9px 0;font-size:12px;font-weight:700;border:none;cursor:pointer;background:${!isDateView?'var(--primary)':'var(--bg2)'};color:${!isDateView?'#fff':'var(--text2)'};border-radius:0;transition:all .2s">Por grupos</button>
      <button onclick="setPredViewMode('date')" style="flex:1;padding:9px 0;font-size:12px;font-weight:700;border:none;cursor:pointer;background:${isDateView?'var(--primary)':'var(--bg2)'};color:${isDateView?'#fff':'var(--text2)'};border-radius:0;transition:all .2s">Por fecha</button>
    </div>
    ${!isDateView ? `
    <div class="phase-selector" id="phase-sel">
      <button class="phase-arrow" id="phase-prev" onclick="changePhase(-1)">‹</button>
      <div class="phase-name" id="phase-name">${PHASES[S.currentPhase]}</div>
      <button class="phase-arrow" id="phase-next" onclick="changePhase(1)">›</button>
    </div>` : ''}
    <div id="phase-body"></div>
  </div>`;
  renderPhaseBody();
}

function renderMatchesByDate(){
  const body = document.getElementById('phase-body'); if(!body) return;
  const preds = ((S.predictions[S.currentLeague]||{})[S.currentUser])||{};

  // Recopilar TODOS los partidos: grupos + fases KO
  const allMatches = [];

  // Grupos
  GROUPS.forEach(g => {
    (MATCHES_GROUP[g]||[]).forEach(m => {
      const sd = S.schedule?.[m.id];
      const date = sd?.date || m.date;
      const time = sd?.time || m.time;
      allMatches.push({ ...m, _date: date, _time: time, _label: 'Grupo ' + g });
    });
  });

  // Fases eliminatorias
  const koPhaseLabels = { 1:'Octavos de Final', 2:'Cuartos de Final', 3:'Semifinales', 4:'Final' };
  [1,2,3,4].forEach(phase => {
    const koMatches = S.knockoutMatches[phase] || KNOCKOUT_TEMPLATES[phase];
    koMatches.forEach(m => {
      const sd = S.schedule?.[m.id];
      const date = sd?.date || m.date;
      const time = sd?.time || m.time;
      allMatches.push({ ...m, _date: date, _time: time, _label: koPhaseLabels[phase] });
    });
  });

  // Ordenar por fecha y hora
  allMatches.sort((a, b) => {
    const da = a._date + 'T' + a._time;
    const db = b._date + 'T' + b._time;
    return da < db ? -1 : da > db ? 1 : 0;
  });

  // Agrupar por fecha
  const byDate = {};
  allMatches.forEach(m => {
    if(!byDate[m._date]) byDate[m._date] = [];
    byDate[m._date].push(m);
  });
  const sortedDates = Object.keys(byDate).sort();

  if(!sortedDates.length){
    body.innerHTML = `<div class="empty-state"><div class="ei">📅</div><p>No hay partidos programados</p></div>`;
    return;
  }

  // Día por defecto: el de hoy (real). Si no hay partidos hoy, el próximo día disponible,
  // y si el torneo ya terminó, el último día disponible. Se recalcula cada vez que se entra
  // de nuevo en el modo "Por fecha" (ver setPredViewMode), pero el usuario puede moverse libremente.
  if(!S.currentDateTab || !byDate[S.currentDateTab]){
    const today = new Date(); today.setHours(0,0,0,0);
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    if(byDate[todayStr]){
      S.currentDateTab = todayStr;
    } else {
      const upcoming = sortedDates.find(d => d >= todayStr);
      S.currentDateTab = upcoming || sortedDates[sortedDates.length-1];
    }
  }

  const tabsHtml = `<div class="group-tabs">${sortedDates.map(d=>
    `<div class="group-tab${d===S.currentDateTab?' active':''}" onclick="selectDateTab('${d}')">${dayShortLabel_(d)}</div>`
  ).join('')}</div>`;

  const dayMatches = byDate[S.currentDateTab] || [];
  const listHtml = dayMatches.map(m => {
    // Pasar _label como info extra en el partido para mostrarlo en la tarjeta
    return matchCardHTML({ ...m, _phaseLabel: m._label }, preds, m._label !== 'Fase de Grupos'? true:false, null);
  }).join('');

  body.innerHTML = tabsHtml +
    `<div class="group-header" style="text-transform:capitalize">${dayHeaderLabel_(S.currentDateTab)}</div>` +
    listHtml +
    `<div class="save-indicator" id="save-ind"></div>`;
}

// Etiqueta corta de un día: Hoy / Mañana / Ayer / "11 Jun" — se recalcula según la fecha real del dispositivo
function dayShortLabel_(dateStr){
  const today = new Date(); today.setHours(0,0,0,0);
  const [y,m,d] = dateStr.split('-').map(Number);
  const dObj = new Date(y, m-1, d);
  const diffDays = Math.round((dObj - today) / 86400000);
  if(diffDays === 0) return 'Hoy';
  if(diffDays === 1) return 'Mañana';
  if(diffDays === -1) return 'Ayer';
  return fmtDate(dateStr);
}

// Etiqueta de cabecera para el día seleccionado (combina Hoy/Mañana/Ayer con la fecha completa)
function dayHeaderLabel_(dateStr){
  const short = dayShortLabel_(dateStr);
  if(short==='Hoy'||short==='Mañana'||short==='Ayer') return `${short} · ${fmtDate(dateStr)}`;
  return short;
}

function selectDateTab(d){
  S.currentDateTab = d;
  renderMatchesByDate();
}

function changePhase(d){ S.currentPhase=Math.max(0,Math.min(4,S.currentPhase+d)); renderPredTab(); }
function setPredViewMode(mode){
  S.predViewMode=mode;
  localStorage.setItem('wf26_pred_view',mode);
  // Al entrar en modo "Por fecha" siempre se abre por defecto en el día de hoy
  if(mode==='date') S.currentDateTab=null;
  renderPredTab();
}

function renderPhaseBody(){
  const body=document.getElementById('phase-body'); if(!body) return;
  if(S.predViewMode==='date'){
    renderMatchesByDate();
    return;
  }
  document.getElementById('phase-prev').disabled=S.currentPhase===0;
  document.getElementById('phase-next').disabled=S.currentPhase===4;
  if(S.currentPhase===0){
    const tabsHtml=`<div class="group-tabs">${GROUPS.map(g=>`<div class="group-tab${g===S.currentGroup?' active':''}" onclick="selectGroup('${g}')">${g}</div>`).join('')}</div>`;
    body.innerHTML=tabsHtml+`<div id="gmatches"></div>`;
    renderGroupMatchList();
  } else {
    const unlockDt=new Date(['','2026-06-29','2026-07-04','2026-07-12','2026-07-19'][S.currentPhase]+'T00:00:00');
    const now=new Date(); const diff=unlockDt-now;
    const koMatches=S.knockoutMatches[S.currentPhase]||KNOCKOUT_TEMPLATES[S.currentPhase];
    const allDefined=koMatches.some(m=>m.n1!=='Por definir');
    if(diff>0 && !allDefined && !isTotalAdmin()){
      const d=Math.floor(diff/(864e5)), h=Math.floor((diff%(864e5))/36e5);
      body.innerHTML=`<div class="lock-card"><div class="lock-icon">🔒</div><div class="lock-msg">${PHASES[S.currentPhase]}</div><div class="lock-time">${d}d ${h}h</div><div class="lock-sub">Se desbloquea cuando se conozcan los cruces</div></div>`;
      return;
    }
    body.innerHTML=`<div id="ko-matches-list"></div>`;
    renderKOMatches();
  }
}

function selectGroup(g){
  S.currentGroup=g;
  document.querySelectorAll('.group-tab').forEach(t=>t.classList.toggle('active',t.textContent===g));
  renderGroupMatchList();
}

let saveTimers={};
function renderGroupMatchList(){
  const c=document.getElementById('gmatches'); if(!c) return;
  const matches=MATCHES_GROUP[S.currentGroup]||[];
  const preds=((S.predictions[S.currentLeague]||{})[S.currentUser])||{};
  c.innerHTML=`<div class="group-header">Grupo ${S.currentGroup}</div>`+matches.map(m=>matchCardHTML(m,preds,false,null))+`<div class="save-indicator" id="save-ind"></div>`;
}

function renderKOMatches(){
  const c=document.getElementById('ko-matches-list'); if(!c) return;
  const matches=S.knockoutMatches[S.currentPhase]||KNOCKOUT_TEMPLATES[S.currentPhase];
  const preds=((S.predictions[S.currentLeague]||{})[S.currentUser])||{};
  c.innerHTML=matches.map(m=>matchCardHTML(m,preds,true,S.currentPhase)).join('')+`<div class="save-indicator" id="save-ind"></div>`;
  // Restaurar valores seleccionados en los desplegables de equipos
  if(isTotalAdmin()){
    matches.forEach(m=>{
      const s1=document.getElementById('adm-ko-sel1-'+m.id);
      const s2=document.getElementById('adm-ko-sel2-'+m.id);
      if(s1 && m.n1 !== 'Por definir') s1.value = m.n1;
      if(s2 && m.n2 !== 'Por definir') s2.value = m.n2;
    });
  }
}

async function adminSwapTeams(mid){
  if(!isTotalAdmin()) return;
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'swapped_matches');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    // Toggle: si ya estaba swapped, lo quitamos; si no, lo añadimos
    const next = { ...existing };
    if(next[mid]) delete next[mid];
    else next[mid] = true;
    await setDoc(ref, next, { merge: false });
    S.swappedMatches = next;
    localStorage.setItem('wf26_swapped', JSON.stringify(next));
    // Si hay resultado guardado, también intercambiar g1/g2 en tournament/results
    if(S.adminResults[mid]){
      const resRef = doc(fbDb(), 'tournament', 'results');
      const resSnap = await getDoc(resRef);
      const resExisting = resSnap.exists() ? (resSnap.data()||{}) : {};
      const r = resExisting[mid];
      if(r && !r.vetoed){
        const flipped = { g1: r.g2, g2: r.g1 };
        await setDoc(resRef, { ...resExisting, [mid]: flipped }, { merge: false });
        S.adminResults[mid] = flipped;
        S.results[mid] = flipped;
        localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults));
      }
    }
    save();
    renderPhaseBody();
    const ind = document.getElementById('save-ind');
    if(ind){ ind.textContent = next[mid] ? '🔄 Equipos intercambiados' : '🔄 Intercambio deshecho'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
  }catch(e){ console.error('adminSwapTeams error', e); alert('Error: '+(e?.message||String(e))); }
}

function matchCardHTML(m, preds, isKnockout, koPhase){
  // Aplicar swap si el admin lo ha marcado (intercambia local y visitante)
  const isSwapped = !!(S.swappedMatches?.[m.id]);
  const mDisplay = isSwapped
    ? { ...m, t1:m.t2, n1:m.n2, t2:m.t1, n2:m.n1 }
    : m;
  const p=preds[m.id]||{g1:'',g2:''};
  // Si swapped, también invertir la predicción mostrada y el resultado
  const pDisplay = isSwapped ? { g1: p.g2??'', g2: p.g1??'' } : p;
  const sd = S.schedule?.[m.id];
  const matchDtParts = (sd?.date||m.date).split('-');
  const [Y,M,D] = matchDtParts;
  const [hh,mm] = (sd?.time||m.time).split(':');
  const matchDt = new Date(Number(Y),Number(M)-1,Number(D),Number(hh),Number(mm),0);
  const closeDt=new Date(matchDt.getTime()-5*60*1000);
  const now=new Date();

  // S.lockOverrides (Firestore, global para todos) tiene prioridad; fallback localStorage
  const lockOverrideVal = S.lockOverrides?.[m.id] ?? localStorage.getItem(`wf26_forced_lock_${m.id}`);
  const hasForcedLock = lockOverrideVal !== null && lockOverrideVal !== undefined;
  const forcedLock = hasForcedLock ? lockOverrideVal === '1' : null;
  const isClosedByTime = now>=closeDt||m.locked;
  const locked = hasForcedLock ? forcedLock : isClosedByTime;
  const resRaw=S.results[m.id];
  // Si swapped, invertir g1/g2 del resultado para mostrar correctamente
  const res = resRaw && isSwapped ? { g1: resRaw.g2, g2: resRaw.g1 } : resRaw;
  const finished=!!res;
  const lockStr=locked?(finished?'✅ Finalizado':'🔒 Cerrado'):`⏰ Cierre: ${fmtTime(closeDt)}`;
  const showPredictionClosedUi = locked&&!finished;
  const predSmall = finished ? `<span class="pred-small">+${calcPoints(res,pDisplay)} pts</span>` : '';
  // Cuando está cerrado: mostrar la predicción real del usuario (solo disabled), no 0-0
  const predForUiClosed = p;

  let resultRow='';
  if(finished){
    const myPts=calcPoints(res,pDisplay);
    resultRow=`<div class="result-row">
      <span class="result-real">Real: ${res.g1} - ${res.g2}</span>
      <span class="result-pred">Tu pred: ${pDisplay.g1!==''?pDisplay.g1:'?'} - ${pDisplay.g2!==''?pDisplay.g2:'?'}</span>
      <span class="result-pts">+${myPts} pts</span>
    </div>`;
    if(S.currentLeague){
      const league=S.leagues[S.currentLeague];
      const rivalsData=league.members.filter(mb=>mb!==S.currentUser).map(mb=>{
        const rp=((S.predictions[S.currentLeague]||{})[mb])||{};
        const rpr=rp[m.id]||{g1:'',g2:''};
        const rprDisplay = isSwapped ? { g1: rpr.g2??'', g2: rpr.g1??'' } : rpr;
        const rpts=calcPoints(res,rprDisplay);
        return `<div class="rival-row"><span class="rival-name">${getDisplayName(mb)}</span><span class="rival-pred">${rprDisplay.g1!==''?rprDisplay.g1:'?'} - ${rprDisplay.g2!==''?rprDisplay.g2:'?'}</span><span class="rival-pts">+${rpts}</span></div>`;
      }).join('');
      if(rivalsData) resultRow+=`<button class="rivals-btn" onclick="toggleRivals('${m.id}')">👥 Ver predicciones rivales</button><div class="rivals-panel" id="rv-${m.id}">${rivalsData}</div>`;
    }
  }

  let adminRow='';
  if(isTotalAdmin()){
    const rg1=res?res.g1:''; const rg2=res?res.g2:'';
    adminRow=`<div class="admin-row">
      <span style="font-size:10px;color:var(--admin);font-weight:700">ADMIN:</span>
      <input class="admin-input" id="adm-${m.id}-1" type="number" min="0" max="20" value="${rg1}" placeholder="?">
      <span style="font-size:11px;color:var(--text3)">-</span>
      <input class="admin-input" id="adm-${m.id}-2" type="number" min="0" max="20" value="${rg2}" placeholder="?">
      <button class="btn-admin" onclick="adminSetResult('${m.id}')">Guardar</button>
      ${finished?`<button class="btn-admin" onclick="adminRecalc('${m.id}')" style="border-color:var(--success);color:var(--success)">Recalc</button>`:''}
    </div>`;
  }

  const adminLockControls = isTotalAdmin() ? `
    <div class="admin-lock-controls">
      <button class="btn-admin" onclick="adminClearResult('${m.id}')" style="border-color:#ef4444;color:#ef4444">Borrar resultado</button>
      <button class="btn-admin" onclick="adminSwapTeams('${m.id}')" style="border-color:#a78bfa;color:#a78bfa">${isSwapped?'↩ Deshacer swap':'🔄 Intercambiar'}</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','0')" style="border-color:var(--success);color:var(--success)">Reabrir</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','1')">Cerrar</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','clear')">Reset</button>
    </div>` : '';

  const adminScheduleRow = isTotalAdmin() ? `
    <div class="admin-row" style="flex-wrap:wrap">
      <span style="font-size:10px;color:var(--admin);font-weight:700">FECHA/HORA:</span>
      <input class="admin-input" id="adm-date-${m.id}" type="date" value="${sd?.date||m.date}" style="width:auto">
      <input class="admin-input" id="adm-time-${m.id}" type="time" value="${sd?.time||m.time}" style="width:auto">
      <button class="btn-admin" onclick="adminSetSchedule('${m.id}')">Guardar</button>
    </div>` : '';

  const _koTeamOptions = ALL_TEAMS.map(t =>
    `<option value="${t.n}" data-flag="${t.f}">${t.f} ${t.n}</option>`
  ).join('');
  const _ko1sel = m.n1 !== 'Por definir' ? m.n1 : '';
  const _ko2sel = m.n2 !== 'Por definir' ? m.n2 : '';
  const adminKnockoutRow = (isTotalAdmin() && isKnockout) ? `
    <div class="admin-row" style="flex-wrap:wrap;gap:6px">
      <span style="font-size:10px;color:var(--admin);font-weight:700;width:100%">EQUIPOS:</span>
      <select id="adm-ko-sel1-${m.id}" style="flex:1;min-width:120px;padding:6px 8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);font-size:12px">
        <option value="">— Local —</option>
        ${_koTeamOptions}
      </select>
      <span style="font-size:11px;color:var(--text3);align-self:center">vs</span>
      <select id="adm-ko-sel2-${m.id}" style="flex:1;min-width:120px;padding:6px 8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);font-size:12px">
        <option value="">— Visitante —</option>
        ${_koTeamOptions}
      </select>
      <button class="btn-admin" onclick="adminSetKnockoutTeams(${koPhase},'${m.id}')" style="width:100%">Guardar cruce</button>
    </div>` : '';

  return `<div class="match-card${finished?' finished':''}" id="mc-${m.id}">
    <div class="match-row">
      <div class="team-side">
        <span class="team-flag">${mDisplay.t1}</span>
        <span class="team-name">${mDisplay.n1}</span>
        <input class="score-input" type="number" min="0" max="20" value="${predForUiClosed?pDisplay.g1:pDisplay.g1}" id="pred-${m.id}-1" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
      <span class="score-sep"> - </span>
      <div class="team-side right">
        <span class="team-flag">${mDisplay.t2}</span>
        <span class="team-name">${mDisplay.n2}</span>
        <input class="score-input" type="number" min="0" max="20" value="${predForUiClosed?pDisplay.g2:pDisplay.g2}" id="pred-${m.id}-2" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
    </div>
    <div class="match-meta"><span>📅 ${fmtDate(sd?.date||m.date)} ${sd?.time||m.time}${m._phaseLabel?` · <span style="color:var(--text2);font-size:10px">${m._phaseLabel}</span>`:''}</span><span>${lockStr} ${predSmall}</span></div>
    ${resultRow}${adminRow}${adminLockControls}${adminScheduleRow}${adminKnockoutRow}
  </div>`;
}

function toggleRivals(mid){ const el=document.getElementById('rv-'+mid); if(!el) return; el.classList.toggle('open'); }

async function savePred(mid){
  if(!S.currentLeague) return;
  clearTimeout(saveTimers[mid]);
  saveTimers[mid]=setTimeout(async ()=>{
    const g1=document.getElementById('pred-'+mid+'-1')?.value||'';
    const g2=document.getElementById('pred-'+mid+'-2')?.value||'';
    try{
      const { doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
      const predRef = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', S.currentUser);
      const snap = await getDoc(predRef);
      const existing = snap.exists()?(snap.data()||{}):{};
      const next = { ...existing, [mid]: { g1, g2 } };
      await setDoc(predRef, next, { merge: false });
      const ind=document.getElementById('save-ind');
      if(ind){ind.textContent='✅ Guardado';setTimeout(()=>{if(ind)ind.textContent='';},1800);}
      if(!S.predictions[S.currentLeague]) S.predictions[S.currentLeague]={};
      S.predictions[S.currentLeague][S.currentUser] = next;
    }catch(e){ console.error('savePred error', e); }
  },700);
}

async function adminSetResult(mid){
  const g1=document.getElementById('adm-'+mid+'-1')?.value;
  const g2=document.getElementById('adm-'+mid+'-2')?.value;
  if(g1===''||g2==='') return;
  if(!S.currentLeague) return;
  try{
    const { doc, setDoc, getDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const rg = { g1: parseInt(g1), g2: parseInt(g2) };

    // 1) Guardar resultado en tournament/results (global para todas las ligas)
    const tournRef = doc(fbDb(), 'tournament', 'results');
    const tournSnap = await getDoc(tournRef);
    const tournExisting = tournSnap.exists() ? (tournSnap.data()||{}) : {};
    await setDoc(tournRef, { ...tournExisting, [mid]: rg }, { merge: false });

    // 2) Recalcular points para TODAS las predicciones de la liga
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id;
      const data=dSnap.data()||{};
      const p=data[mid]||{g1:'',g2:''};
      const pts=calcPoints(rg,p);
      const updated = { ...data, [mid]: { ...p, points: pts } };
      // Calcular total acumulado (excluir _totalPts que no es una predicción)
      const totalPts = Object.entries(updated).reduce((acc,[k,v])=> k==='_totalPts'?acc : acc+(v?.points||0), 0);
      updated._totalPts = totalPts;
      await setDoc(
        doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid),
        updated,
        { merge: false }
      );
    }));

    // 3) Limpiar cache de otros usuarios y redibujar
    S.results[mid]=rg;
    S.adminResults = S.adminResults || {};
    S.adminResults[mid] = rg;
    // Si había un veto previo, quitarlo (el admin está forzando un resultado nuevo)
    if(S.vetoed && S.vetoed[mid]) {
      delete S.vetoed[mid];
      localStorage.setItem('wf26_vetoed', JSON.stringify(S.vetoed));
    }
    localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults));
    Object.keys(S.predictions[S.currentLeague]||{}).forEach(uid=>{
      if(uid !== S.currentUser) delete S.predictions[S.currentLeague][uid];
    });
    renderPhaseBody();
    renderRanking();
    const ind=document.getElementById('save-ind');
    if(ind){ind.textContent='✅ Resultado guardado';setTimeout(()=>{if(ind)ind.textContent='';},2000);}
  }catch(e){ console.error('adminSetResult error', e); }
}

async function forceToggleLock(mid, val){
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'lock_overrides');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    let next;
    if(val==='clear'){
      next = { ...existing };
      delete next[mid];
    } else {
      next = { ...existing, [mid]: val };
    }
    await setDoc(ref, next, { merge: false });
    S.lockOverrides = next;
    localStorage.setItem('wf26_lock_overrides', JSON.stringify(next));
  }catch(e){
    console.error('forceToggleLock error', e);
    const key = `wf26_forced_lock_${mid}`;
    if(val==='clear') localStorage.removeItem(key);
    else localStorage.setItem(key, val);
  }
  renderPredTab();
}

async function adminClearResult(mid){
  if(!S.currentLeague) return;
  if(!confirm('¿Borrar el resultado de este partido? Los puntos calculados se perderán.')) return;
  try{
    const { doc, setDoc, getDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');

    // 1) Marcar como vetado en tournament/results (global)
    const tournRef2 = doc(fbDb(), 'tournament', 'results');
    const tournSnap2 = await getDoc(tournRef2);
    const tournExisting2 = tournSnap2.exists() ? (tournSnap2.data()||{}) : {};
    await setDoc(tournRef2, { ...tournExisting2, [mid]: { vetoed: true } }, { merge: false });

    // 2) Limpiar el campo points de ese partido en todas las predicciones
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid = dSnap.id;
      const data = dSnap.data() || {};
      if(!data[mid]) return;
      const { points: _removed, ...predWithoutPts } = data[mid];
      const updated = { ...data, [mid]: predWithoutPts };
      updated._totalPts = Object.entries(updated).reduce((acc,[k,v])=> k==='_totalPts'?acc : acc+(v?.points||0), 0);
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), updated, { merge: false });
    }));

    // 3) Actualizar cache local
    delete S.results[mid];
    if(S.adminResults) delete S.adminResults[mid];
    S.vetoed = S.vetoed || {};
    S.vetoed[mid] = true;
    localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults||{}));
    localStorage.setItem('wf26_vetoed', JSON.stringify(S.vetoed));
    Object.keys(S.predictions[S.currentLeague]||{}).forEach(uid=>{
      if(uid !== S.currentUser) delete S.predictions[S.currentLeague][uid];
    });

    renderPhaseBody();
    renderRanking();
    const ind = document.getElementById('save-ind');
    if(ind){ ind.textContent='🗑️ Resultado borrado'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
  }catch(e){ console.error('adminClearResult error', e); alert('Error al borrar: '+(e?.message||String(e))); }
}

async function adminRecalc(mid){
  if(!S.currentLeague) return;
  try{
    const { doc, getDoc, setDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const resSnap = await getDoc(doc(fbDb(), 'tournament', 'results'));
    const allResults = resSnap.exists() ? (resSnap.data()||{}) : {};
    const rg = allResults[mid];
    if(!rg || rg.vetoed) return;
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id, data=dSnap.data()||{};
      const p=data[mid]||{g1:'',g2:''};
      const pts=calcPoints(rg,p);
      const updated = {...data,[mid]:{...p,points:pts}};
      updated._totalPts = Object.values(updated).reduce((acc,v)=>acc+(v?.points||0),0);
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), updated, {merge:false});
    }));
    Object.keys(S.predictions[S.currentLeague]||{}).forEach(uid=>{
      if(uid !== S.currentUser) delete S.predictions[S.currentLeague][uid];
    });
    renderPhaseBody();
    renderRanking();
    const ind=document.getElementById('save-ind');
    if(ind){ind.textContent='✅ Puntos recalculados';setTimeout(()=>{if(ind)ind.textContent='';},2000);}
  }catch(e){ console.error('adminRecalc error', e); }
}

function calcPoints(res, pred){
  if(!res) return 0;
  const rg1=parseInt(res.g1), rg2=parseInt(res.g2);
  const pg1=pred.g1!==''&&pred.g1!==undefined&&pred.g1!==null?parseInt(pred.g1):null;
  const pg2=pred.g2!==''&&pred.g2!==undefined&&pred.g2!==null?parseInt(pred.g2):null;
  if(pg1===null||pg2===null) return 0;
  if(pg1===rg1&&pg2===rg2) return 7;
  const realWinner=rg1>rg2?1:(rg2>rg1?2:0);
  const predWinner=pg1>pg2?1:(pg2>pg1?2:0);
  const acertaGanador=predWinner===realWinner;
  const acertaG1=pg1===rg1, acertaG2=pg2===rg2;
  const aciertaAlgunGol=acertaG1||acertaG2;
  const aciertaAmbosGoles=acertaG1&&acertaG2;
  if(aciertaAlgunGol&&!aciertaAmbosGoles&&!acertaGanador) return 1;
  if(acertaGanador&&!aciertaAlgunGol) return 2;
  if(acertaGanador&&aciertaAlgunGol&&!aciertaAmbosGoles) return 4;
  return 0;
}

// ===== RANKING =====
function getUserPts(user, leagueCode){
  const data = S.predictions?.[leagueCode]?.[user];
  if(!data) return 0;
  return Object.entries(data).reduce((acc, [mid, p]) => {
    if(mid === '_totalPts') return acc;
    const res = S.results?.[mid];
    if(!res) return acc;
    return acc + calcPoints(res, p);
  }, 0);
}

// Carga desde Firestore las predicciones de todos los miembros de una liga.
// Usa getDocs sobre la subcolección completa para que cualquier miembro pueda leer todo
// (las reglas de Firestore deben permitir leer /leagues/{code}/predictions a miembros de esa liga).
async function ensureLeaguePredictionsLoaded(leagueCode, memberUids){
  try{
    const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    if(!S.predictions[leagueCode]) S.predictions[leagueCode] = {};
    const snaps = await getDocs(collection(fbDb(), 'leagues', leagueCode, 'predictions'));
    snaps.forEach(d=>{
      S.predictions[leagueCode][d.id] = d.data() || {};
    });
  }catch(e){
    console.error('ensureLeaguePredictionsLoaded error', leagueCode, e);
    // Fallback: intentar cargar uid por uid (por si las reglas son más restrictivas)
    try{
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
      if(!S.predictions[leagueCode]) S.predictions[leagueCode] = {};
      await Promise.all((memberUids||[]).map(async uid => {
        try{
          const snap = await getDoc(doc(fbDb(), 'leagues', leagueCode, 'predictions', uid));
          S.predictions[leagueCode][uid] = snap.exists() ? (snap.data()||{}) : {};
        }catch(e2){ /* sin permisos para este uid */ }
      }));
    }catch(e2){ console.error('ensureLeaguePredictionsLoaded fallback error', e2); }
  }
}

async function ensureUsersLoaded(uids){

  try{
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const need=(uids||[]).filter(uid=>uid&&!S.users?.[uid]);
    await Promise.all(need.map(async uid=>{
      const snap=await getDoc(doc(fbDb(),'users',uid));
      if(snap.exists()){
        const d=snap.data()||{};
        S.users[uid]={ username:d.username||'', firstName:(d.firstName||'').trim(), avatar:d.avatarUrl||null };
      } else {
        S.users[uid]={ username:uid, firstName:'', avatar:null };
      }
    }));
  }catch(e){ console.error('ensureUsersLoaded error', e); }
}

async function renderRanking(){
  const listEl=document.getElementById('ranking-list');
  const filtersEl=document.getElementById('ranking-filters');
  if(!listEl||!filtersEl) return;

  const isGroupsView = S.rankingViewMode === 'grupos';

  filtersEl.innerHTML = `
    <button class="filter-btn${!isGroupsView?' active':''}" onclick="setRankingViewMode('liga')" style="flex:1">🏆 Mi Liga</button>
    <button class="filter-btn${isGroupsView?' active':''}" onclick="setRankingViewMode('grupos')" style="flex:1">⚽ Clasificación</button>
  `;

  if(isGroupsView){
    renderGroupStandingsView(listEl);
    return;
  }

  // desplegable: liga seleccionada
  const eligibleCodes = Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  const selected = (S.currentLeague && S.leagues && S.leagues[S.currentLeague]) ? S.currentLeague : (eligibleCodes[0] || null);

  // si no hay selección válida, ocultar tabla
  if(!selected){
    listEl.innerHTML=`<div class="empty-state"><div class="ei">📊</div><p>Únete a una liga para ver la tabla</p></div>`;
    return;
  }

  // Si no hay selección guardada, dejarla en un valor válido
  if(!S.currentLeague || !S.leagues?.[S.currentLeague]){
    S.currentLeague = selected;
  }

  const selectedLeague = S.leagues[selected];
  const memberUids = [...new Set([...(selectedLeague?.members||[]), S.currentUser])];
  await ensureUsersLoaded(memberUids);
  await ensureLeaguePredictionsLoaded(selected, memberUids);

  const scores=(selectedLeague.members||[]).map(m=>({
    uid:m,
    name:getDisplayName(m),
    pts:getUserPts(m, selected),
    avatar:S.users?.[m]?.avatar
  }));
  scores.sort((a,b)=>b.pts-a.pts);

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:4px 0 10px;">
      <div style="font-size:12px;color:var(--text2);white-space:nowrap;">Liga:</div>
      <select id="ranking-league-select" onchange="setRankingLeague(this.value)" style="flex:1;padding:8px 10px;border-radius:10px;background:var(--bg3);color:var(--text);border:1px solid var(--border);">
        ${eligibleCodes.map(code=>{
          const l=S.leagues[code];
          return `<option value="${code}" ${code===selected?'selected':''}>${l?.name||code}</option>`;
        }).join('')}
      </select>
    </div>
    <div class="rank-league-label">${selectedLeague.name}</div>`;
  scores.forEach((s,i)=>{
    const posC=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const posI=i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;
    const isMe=s.uid===S.currentUser;
    const av=s.avatar?`<img src="${s.avatar}">`:`<span style="font-size:16px">😎</span>`;
    html+=`<div class="rank-item${isMe?' me':''}"><div class="rank-pos ${posC}">${posI}</div><div class="rank-avatar">${av}</div><div class="rank-name">${s.name}${isMe?' (Tú)':''}</div><div class="rank-pts">${s.pts}</div></div>`;
  });
  listEl.innerHTML=html;
}

function setRankingViewMode(mode){
  S.rankingViewMode = mode;
  localStorage.setItem('wf26_ranking_view', mode);
  renderRanking().catch(()=>{});
}

function setRankingLeague(code){
  S.currentLeague = code;
  renderRanking().catch(()=>{});
}

// ===== CLASIFICACIÓN DE GRUPOS (equipos) =====

// Calcula la tabla de un grupo a partir de los resultados finales guardados en S.results.
// Orden: puntos > resultado directo (entre los dos equipos empatados) > diferencia de goles > goles a favor.
function computeGroupStandings(group){
  const teams = GROUP_TEAMS[group] || [];
  const stats = {};
  teams.forEach(t => {
    stats[t.n] = { name:t.n, flag:t.f, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 };
  });
  const matches = MATCHES_GROUP[group] || [];
  const h2h = {};
  matches.forEach(m => {
    const res = S.results?.[m.id];
    if(!res) return;
    const g1 = Number(res.g1), g2 = Number(res.g2);
    if(!isFinite(g1) || !isFinite(g2)) return;
    const s1 = stats[m.n1], s2 = stats[m.n2];
    if(!s1 || !s2) return;
    s1.pj++; s2.pj++;
    s1.gf += g1; s1.gc += g2;
    s2.gf += g2; s2.gc += g1;
    if(g1 > g2){ s1.pg++; s1.pts += 3; s2.pp++; }
    else if(g2 > g1){ s2.pg++; s2.pts += 3; s1.pp++; }
    else { s1.pe++; s2.pe++; s1.pts += 1; s2.pts += 1; }
    h2h[m.n1+'__'+m.n2] = { gf:g1, gc:g2 };
    h2h[m.n2+'__'+m.n1] = { gf:g2, gc:g1 };
  });
  const list = Object.values(stats);
  list.sort((a,b)=>{
    if(b.pts !== a.pts) return b.pts - a.pts;
    const direct = h2h[a.name+'__'+b.name];
    if(direct){
      const diff = direct.gf - direct.gc; // >0 = a ganó a b en el cara a cara
      if(diff !== 0) return -diff;
    }
    const dgA = a.gf - a.gc, dgB = b.gf - b.gc;
    if(dgB !== dgA) return dgB - dgA;
    if(b.gf !== a.gf) return b.gf - a.gf;
    return 0;
  });
  return list;
}

function computeAllGroupStandings(){
  const map = {};
  GROUPS.forEach(g => { map[g] = computeGroupStandings(g); });
  return map;
}

// Ranking de las terceras de cada grupo: puntos > diferencia de goles > goles a favor (no hay resultado directo posible, son de grupos distintos)
function computeBestThirds(allStandings){
  const thirds = GROUPS.map(g => {
    const t = (allStandings[g] || [])[2];
    return t ? { ...t, group:g } : null;
  }).filter(Boolean);
  thirds.sort((a,b)=>{
    if(b.pts !== a.pts) return b.pts - a.pts;
    const dgA = a.gf - a.gc, dgB = b.gf - b.gc;
    if(dgB !== dgA) return dgB - dgA;
    if(b.gf !== a.gf) return b.gf - a.gf;
    return 0;
  });
  return thirds;
}

// Devuelve el set de nombres de equipo clasificados: 1º y 2º de cada grupo + las 8 mejores terceras
function computeQualifiedTeams(){
  const all = computeAllGroupStandings();
  const thirds = computeBestThirds(all);
  const qualifiedThirdNames = new Set(thirds.slice(0,8).map(t=>t.name));
  const qualified = new Set();
  GROUPS.forEach(g=>{
    const st = all[g] || [];
    if(st[0]) qualified.add(st[0].name);
    if(st[1]) qualified.add(st[1].name);
    if(st[2] && qualifiedThirdNames.has(st[2].name)) qualified.add(st[2].name);
  });
  return qualified;
}

function standingsHeaderHTML_(){
  return `<div class="standings-header"><span class="sh-team">Equipo</span><span class="sh-stats"><span>Pts</span><span>PJ</span><span>PG</span><span>PE</span><span>PP</span><span>GF</span><span>GC</span><span>DG</span></span></div>`;
}

function standingsRowHTML_(t, pos, qualifiedSet, extraLabel){
  const dg = t.gf - t.gc;
  const dgStr = dg > 0 ? `+${dg}` : `${dg}`;
  const cls = qualifiedSet.has(t.name) ? 'qualified' : 'eliminated';
  return `<div class="standing-row ${cls}">
    <div class="standing-team">
      <span class="standing-pos">${pos}</span>
      <span class="standing-flag">${t.flag}</span>
      <span class="standing-name">${t.name}${extraLabel?` <span style="color:var(--text3);font-weight:500">${extraLabel}</span>`:''}</span>
    </div>
    <div class="standing-stats">
      <span class="st-pts">${t.pts}</span>
      <span>${t.pj}</span>
      <span>${t.pg}</span>
      <span>${t.pe}</span>
      <span>${t.pp}</span>
      <span>${t.gf}</span>
      <span>${t.gc}</span>
      <span>${dgStr}</span>
    </div>
  </div>`;
}

function renderGroupTable(group, qualifiedSet){
  const standings = computeGroupStandings(group);
  let html = `<div class="group-header">Grupo ${group}</div>` + standingsHeaderHTML_();
  standings.forEach((t,i)=>{ html += standingsRowHTML_(t, i+1, qualifiedSet, null); });
  return html;
}

function renderBestThirdsTable(qualifiedSet){
  const all = computeAllGroupStandings();
  const thirds = computeBestThirds(all);
  let html = `<div class="group-header">Mejores Terceras</div>` + standingsHeaderHTML_();
  thirds.forEach((t,i)=>{ html += standingsRowHTML_(t, i+1, qualifiedSet, `(${t.group})`); });
  return html;
}

function renderGroupStandingsView(listEl){
  if(!S.currentStandingsGroup) S.currentStandingsGroup = 'A';
  const tabs = [...GROUPS, 'BEST3'];
  const tabsHtml = `<div class="group-tabs">${tabs.map(g=>
    `<div class="group-tab${g===S.currentStandingsGroup?' active':''}" onclick="selectStandingsGroup('${g}')">${g==='BEST3'?'3os':g}</div>`
  ).join('')}</div>`;

  const qualified = computeQualifiedTeams();
  const bodyHtml = S.currentStandingsGroup === 'BEST3'
    ? renderBestThirdsTable(qualified)
    : renderGroupTable(S.currentStandingsGroup, qualified);

  listEl.innerHTML = tabsHtml + bodyHtml;
}

function selectStandingsGroup(g){
  S.currentStandingsGroup = g;
  renderRanking().catch(()=>{});
}

// ===== PREDICCIONES (Firestore -> cache local) =====
async function loadPredictionsFromFirestoreForCurrentUser(){
  try{
    if(!S.currentUser) return;
    // Asegura que S.leagues esté poblado
    const leagueCodes = Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
    if(!leagueCodes.length) return;

    // Estructura esperada en UI:
    // S.predictions[leagueCode][userUid][matchId] = {g1,g2,points?}
    if(!S.predictions) S.predictions = {};

    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');

    for(const code of leagueCodes){
      const predRef = doc(fbDb(), 'leagues', code, 'predictions', S.currentUser);
      const snap = await getDoc(predRef);
      if(!snap.exists()) continue;
      const data = snap.data() || {};

      // data es un objeto { [matchId]: {g1,g2,points?} }
      // lo volcamos tal cual para que la UI pinte g1/g2 y ranking use points si existen.
      if(!S.predictions[code]) S.predictions[code] = {};
      S.predictions[code][S.currentUser] = data;
    }
  }catch(e){
    console.error('loadPredictionsFromFirestoreForCurrentUser error', e);
  }
}


// ===== INFO / PERFIL =====
function getDisplayName(uid){
  const u=S.users?.[uid];
  const fn=(u?.firstName||'').trim();
  if(fn) return fn;
  return (u?.username||uid).trim();
}

function renderProfileInfo(){
  const el=document.getElementById('profile-username-display');
  if(el) el.textContent=getDisplayName(S.currentUser)+(isTotalAdmin()?' 👑':'');
  const ab=document.getElementById('profile-avatar-big');
  if(ab){
    const ua=S.users[S.currentUser]?.avatar;
    const em=document.getElementById('profile-avatar-emoji');
    if(ua){ if(em) em.style.display='none'; let img=ab.querySelector('img.pi');if(!img){img=document.createElement('img');img.className='pi';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;';ab.appendChild(img);}img.src=ua; }
  }
}

function updateProfilePic(input){
  if(!input.files[0]) return;
  const r=new FileReader(); r.onload=e=>{S.users[S.currentUser].avatar=e.target.result;save();renderProfileInfo();}; r.readAsDataURL(input.files[0]);
}

async function saveProfileFirstName(){
  try{
    const el=document.getElementById('profile-firstname-edit');
    if(!el) return;
    if(!S.currentUser) return;
    const val=(el.value||'').trim();
    // firstName es el nombre que se ve en rankings (si no existe, mostramos username)
    S.users[S.currentUser]=S.users[S.currentUser]||{username:'',firstName:'',avatar:null};
    S.users[S.currentUser].firstName=val;

    // persistir en firestore
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    await setDoc(doc(fbDb(),'users',S.currentUser), { firstName: val, updatedAt: Date.now() }, { merge: true });

    save();
    renderProfileInfo();
    // refrescar tabla si estaba abierta
    if(document.getElementById('tab-tabla')?.classList.contains('active')) renderRanking();
  }catch(e){
    console.error('saveProfileFirstName error', e);
  }
}

// ===== UTILS =====
function fmtDate(d){ const[y,m,dd]=d.split('-');const ms=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];return`${parseInt(dd)} ${ms[parseInt(m)-1]}`; }
function fmtTime(dt){ return dt.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}); }

// Init
if(S.currentUser){
  (async ()=>{
    // recargar estado completo del usuario actual
    reloadStateForCurrentUser();
    if(!S.users) S.users = {};

    // sincronizar ligas desde Firestore para evitar que localStorage esté vacío
    await refreshUserLeagues();

    // cargar predicciones guardadas en Firestore para que persistan tras recargar
    await loadPredictionsFromFirestoreForCurrentUser();

    showMain();
  })();
}
