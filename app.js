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
  K:[{f:'🇵🇹',n:'Portugal'},{f:'🇨🇩',n:'República Democrática del Congo'},{f:'🇺🇿',n:'Uzbekistán'},{f:'🇨🇴',n:'Colombia'}],
  L:[{f:'🏴',n:'Inglaterra'},{f:'🇭🇷',n:'Croacia'},{f:'🇬🇭',n:'Ghana'},{f:'🇵🇦',n:'Panamá'}]
};

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
  currentUser: localStorage.getItem('wf26_cu')||null,
  currentPhase: 0,
  currentGroup: 'A',
  currentLeague: null,
  currentRankPhase: 'total'
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

async function startAutoUpdateResults(){
  console.log('[wf26] startAutoUpdateResults');
  if(autoResultsTimer) clearInterval(autoResultsTimer);

  const first = await fetchResultsFromSheet();
  if(first){
    S.results = first.results || {};
    S.schedule = first.schedule || {};
    save();
    renderPredTab();
    renderRanking();
    renderPhaseBody();
  }

  autoResultsTimer = setInterval(async ()=>{
    const next = await fetchResultsFromSheet();
    if(!next) return;
    const nextResults = next.results || {};
    const nextSchedule = next.schedule || {};
    const prev = S.results || {};
    const changed = Object.keys(nextResults).some(mid=>{
      const a=nextResults[mid]||{}, b=prev[mid]||{};
      return Number(a.g1)!==Number(b.g1)||Number(a.g2)!==Number(b.g2);
    }) || Object.keys(prev).length !== Object.keys(nextResults).length;
    const prevSched = S.schedule || {};
    const schedChanged = Object.keys(nextSchedule).some(mid=>{
      const a=nextSchedule[mid]||{}, b=prevSched[mid]||{};
      return a.date!==b.date||a.time!==b.time;
    }) || Object.keys(prevSched).length !== Object.keys(nextSchedule).length;
    if(!changed && !schedChanged) return;
    S.results = nextResults;
    S.schedule = nextSchedule;
    save();
    renderPhaseBody();
    renderPredTab();
    renderRanking();
  }, 60000);
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
function openModal(type){
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
    const pts=getUserPts(S.currentUser,code,'total');
    let av=l.avatar?`<img src="${l.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span style="font-size:18px">🏆</span>`;
    const isSelected=S.currentLeague===code;
    const isCreator = String(l.creatorUid) === String(S.currentUser);

    const exitBtn = isCreator
      ? `<button class="btn-exit" onclick="leaveLeague('${code}','delete');event.stopPropagation();">🗑️ Eliminar</button>`
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

function renderPredTab(){
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
  inner.innerHTML=`<div style="padding:0 0 0">
    <div style="padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:11px;color:var(--text2)">Liga:</span>
      <button class="league-sel-btn" onclick="openModal('pick-league')"><span class="league-sel-name">${league.name}</span> ▾</button>
    </div>
    <div class="phase-selector" id="phase-sel">
      <button class="phase-arrow" id="phase-prev" onclick="changePhase(-1)">‹</button>
      <div class="phase-name" id="phase-name">${PHASES[S.currentPhase]}</div>
      <button class="phase-arrow" id="phase-next" onclick="changePhase(1)">›</button>
    </div>
    <div id="phase-body"></div>
  </div>`;
  renderPhaseBody();
}

function changePhase(d){ S.currentPhase=Math.max(0,Math.min(4,S.currentPhase+d)); renderPredTab(); }

function renderPhaseBody(){
  const body=document.getElementById('phase-body'); if(!body) return;
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
  c.innerHTML=`<div class="group-header">Grupo ${S.currentGroup}</div>`+matches.map(m=>matchCardHTML(m,preds))+`<div class="save-indicator" id="save-ind"></div>`;
}

function renderKOMatches(){
  const c=document.getElementById('ko-matches-list'); if(!c) return;
  const matches=S.knockoutMatches[S.currentPhase]||KNOCKOUT_TEMPLATES[S.currentPhase];
  const preds=((S.predictions[S.currentLeague]||{})[S.currentUser])||{};
  c.innerHTML=matches.map(m=>matchCardHTML(m,preds)).join('')+`<div class="save-indicator" id="save-ind"></div>`;
}

function matchCardHTML(m, preds){
  const p=preds[m.id]||{g1:'',g2:''};
  const sd = S.schedule?.[m.id];
  const matchDtParts = (sd?.date||m.date).split('-');
  const [Y,M,D] = matchDtParts;
  const [hh,mm] = (sd?.time||m.time).split(':');
  const matchDt = new Date(Number(Y),Number(M)-1,Number(D),Number(hh),Number(mm),0);
  const closeDt=new Date(matchDt.getTime()-5*60*1000);
  const now=new Date();

  const forcedLockKey = `wf26_forced_lock_${m.id}`;
  const forcedLockRaw = localStorage.getItem(forcedLockKey);
  const hasForcedLock = forcedLockRaw !== null;
  const forcedLock = hasForcedLock ? forcedLockRaw==='1' : null;
  const isClosedByTime = now>=closeDt||m.locked;
  const locked = isTotalAdmin()&&hasForcedLock ? forcedLock : isClosedByTime;
  const res=S.results[m.id];
  const finished=!!res;
  const lockStr=locked?(finished?'✅ Finalizado':'🔒 Cerrado'):`⏰ Cierre: ${fmtTime(closeDt)}`;
  const showPredictionClosedUi = locked&&!finished;
  const predSmall = showPredictionClosedUi
    ? `<span class="pred-small">0-0</span>`
    : (finished ? `<span class="pred-small">+${calcPoints(res,p)} pts</span>` : '');
  const predForUiClosed = showPredictionClosedUi ? {g1:0,g2:0} : p;

  let resultRow='';
  if(finished){
    const myPts=calcPoints(res,p);
    resultRow=`<div class="result-row">
      <span class="result-real">Real: ${res.g1} - ${res.g2}</span>
      <span class="result-pred">Tu pred: ${p.g1!==''?p.g1:'?'} - ${p.g2!==''?p.g2:'?'}</span>
      <span class="result-pts">+${myPts} pts</span>
    </div>`;
    if(S.currentLeague){
      const league=S.leagues[S.currentLeague];
      const rivalsData=league.members.filter(mb=>mb!==S.currentUser).map(mb=>{
        const rp=((S.predictions[S.currentLeague]||{})[mb])||{};
        const rpr=rp[m.id]||{g1:'',g2:''};
        const rpts=calcPoints(res,rpr);
        return `<div class="rival-row"><span class="rival-name">${getDisplayName(mb)}</span><span class="rival-pred">${rpr.g1!==''?rpr.g1:'?'} - ${rpr.g2!==''?rpr.g2:'?'}</span><span class="rival-pts">+${rpts}</span></div>`;
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
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','0')">Reabrir</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','1')">Cerrar</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','clear')">Reset</button>
    </div>` : '';

  return `<div class="match-card${finished?' finished':''}" id="mc-${m.id}">
    <div class="match-row">
      <div class="team-side">
        <span class="team-flag">${m.t1}</span>
        <span class="team-name">${m.n1}</span>
        <input class="score-input" type="number" min="0" max="20" value="${predForUiClosed?predForUiClosed.g1:p.g1}" id="pred-${m.id}-1" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
      <span class="score-sep"> - </span>
      <div class="team-side right">
        <span class="team-flag">${m.t2}</span>
        <span class="team-name">${m.n2}</span>
        <input class="score-input" type="number" min="0" max="20" value="${predForUiClosed?predForUiClosed.g2:p.g2}" id="pred-${m.id}-2" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
    </div>
    <div class="match-meta"><span>📅 ${fmtDate(sd?.date||m.date)} ${sd?.time||m.time}</span><span>${lockStr} ${predSmall}</span></div>
    ${resultRow}${adminRow}${adminLockControls}
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
    const { doc, setDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const rg = { g1: parseInt(g1), g2: parseInt(g2) };
    await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'results', mid), rg, { merge: true });
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id, data=dSnap.data()||{};
      const p=data[mid]||{g1:'',g2:''};
      const pts=calcPoints(rg,p);
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), {...data,[mid]:{...p,points:pts}}, {merge:false});
    }));
    S.results[mid]=rg;
    renderPhaseBody();
  }catch(e){ console.error('adminSetResult error', e); }
}

function forceToggleLock(mid, val){
  const key=`wf26_forced_lock_${mid}`;
  if(val==='clear') localStorage.removeItem(key);
  else localStorage.setItem(key,val);
  renderPhaseBody();
  renderPredTab();
}

async function adminRecalc(mid){
  if(!S.currentLeague) return;
  try{
    const { doc, getDoc, setDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const resSnap = await getDoc(doc(fbDb(), 'leagues', S.currentLeague, 'results', mid));
    if(!resSnap.exists()) return;
    const rg = resSnap.data()||{};
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id, data=dSnap.data()||{};
      const p=data[mid]||{g1:'',g2:''};
      const pts=calcPoints(rg,p);
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), {...data,[mid]:{...p,points:pts}}, {merge:false});
    }));
    renderPhaseBody();
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
function getUserPts(user, leagueCode, phase){
  if(!S.predictions[leagueCode]||!S.predictions[leagueCode][user]) return 0;
  return Object.values(S.predictions[leagueCode][user]).reduce((acc,p)=>acc+(p.points||0),0);
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
  const myLeagues=Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  filtersEl.innerHTML=['Total',...PHASES].map((f,i)=>{
    const fv=i===0?'total':i-1;
    return `<div class="filter-btn${S.currentRankPhase===fv?' active':''}" onclick="setRankPhase(${i===0?"'total'":i-1})">${f}</div>`;
  }).join('');

  // desplegable: liga seleccionada
  const eligibleCodes = Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  const selected = (S.currentLeague && S.leagues && S.leagues[S.currentLeague]) ? S.currentLeague : (eligibleCodes[0] || null);

  // si no hay selección válida, ocultar tabla
  if(!selected){
    listEl.innerHTML=`<div class="empty-state"><div class="ei">📊</div><p>Únete a una liga para ver la tabla</p></div>`;
    return;
  }

  filtersEl.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="font-size:12px;color:var(--text2);white-space:nowrap;">Liga:</div>
        <select id="ranking-league-select" onchange="setRankingLeague(this.value)" style="flex:1;padding:8px 10px;border-radius:10px;background:var(--bg3);color:var(--text);border:1px solid var(--border);">
          ${eligibleCodes.map(code=>{
            const l=S.leagues[code];
            return `<option value="${code}" ${code===selected?'selected':''}>${l?.name||code}</option>`;
          }).join('')}
        </select>
      </div>
      <div class="ranking-phase-filters" style="display:flex;gap:10px;flex-wrap:wrap;">
        ${['Total',...PHASES].map((f,i)=>{
          const fv=i===0?'total':i-1;
          return `<div class="filter-btn${S.currentRankPhase===fv?' active':''}" onclick="setRankPhase(${i===0?"'total'":i-1})">${f}</div>`;
        }).join('')}
      </div>
    </div>
  `;

  function setRankingLeague(code){
    S.currentLeague = code;
    renderRanking().catch(()=>{});
  }

  // Si no hay selección guardada, nos aseguramos de dejarla en un valor válido
  if(!S.currentLeague || !S.leagues?.[S.currentLeague]){
    S.currentLeague = selected;
  }

  if(false){

    listEl.innerHTML=`<div class="empty-state"><div class="ei">📊</div><p>Únete a una liga para ver la tabla</p></div>`;
    return;
  }
  const selectedLeague = S.leagues[selected];

  const memberUids=[];
  (selectedLeague?.members||[]).forEach(uid=>memberUids.push(uid));
  memberUids.push(S.currentUser);
  await ensureUsersLoaded([...new Set(memberUids)]);

  // Render SOLO la liga seleccionada
  let html='';
  const l=selectedLeague;
  const scores=(l.members||[]).map(m=>({
    uid:m,
    name:getDisplayName(m),
    pts:getUserPts(m, selected, S.currentRankPhase),
    avatar:S.users?.[m]?.avatar
  }));
  scores.sort((a,b)=>b.pts-a.pts);
  html+=`<div class="rank-league-label">${l.name}</div>`;
  scores.forEach((s,i)=>{
    const posC=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const posI=i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;
    const isMe=s.uid===S.currentUser;
    const av=s.avatar?`<img src="${s.avatar}">`:`<span style="font-size:16px">😎</span>`;
    html+=`<div class="rank-item${isMe?' me':''}"><div class="rank-pos ${posC}">${posI}</div><div class="rank-avatar">${av}</div><div class="rank-name">${s.name}${isMe?' (Tú)':''}</div><div class="rank-pts">${s.pts}</div></div>`;
  });
  listEl.innerHTML=html;
}

function setRankPhase(f){ S.currentRankPhase=f; renderRanking().catch(()=>{}); }

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
