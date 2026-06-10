// ===== DATA =====
const PHASES = ['Fase de Grupos','Octavos de Final','Cuartos de Final','Semifinales','Final'];
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// Mapeo: tu app usa username, Firebase Auth usa email.
// Guardaremos usuarios en Firestore: users/{uid} = { username, avatarUrl }
// Admin: vamos a detectar admin con un doc admins/{uid} = true (más adelante podemos endurecer reglas).

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
function makeGroupMatches(){
  const base = {
    A:['2026-06-11','2026-06-11','2026-06-15','2026-06-15','2026-06-19','2026-06-19'],
    B:['2026-06-12','2026-06-12','2026-06-16','2026-06-16','2026-06-20','2026-06-20'],
    C:['2026-06-12','2026-06-12','2026-06-16','2026-06-16','2026-06-20','2026-06-20'],
    D:['2026-06-13','2026-06-13','2026-06-17','2026-06-17','2026-06-21','2026-06-21'],
    E:['2026-06-13','2026-06-13','2026-06-17','2026-06-17','2026-06-21','2026-06-21'],
    F:['2026-06-14','2026-06-14','2026-06-18','2026-06-18','2026-06-22','2026-06-22'],
    G:['2026-06-14','2026-06-14','2026-06-18','2026-06-18','2026-06-22','2026-06-22'],
    H:['2026-06-15','2026-06-15','2026-06-19','2026-06-19','2026-06-23','2026-06-23'],
    I:['2026-06-15','2026-06-15','2026-06-19','2026-06-19','2026-06-23','2026-06-23'],
    J:['2026-06-16','2026-06-16','2026-06-20','2026-06-20','2026-06-24','2026-06-24'],
    K:['2026-06-17','2026-06-17','2026-06-21','2026-06-21','2026-06-25','2026-06-25'],
    L:['2026-06-18','2026-06-18','2026-06-22','2026-06-22','2026-06-26','2026-06-26']
  };
  const times = ['18:00','21:00','18:00','21:00','21:00','21:00'];
  const pairs = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
  const res = {};
  GROUPS.forEach(g=>{
    const ts = GROUP_TEAMS[g];
    res[g] = pairs.map((p,i)=>({
      id:`${g}${i+1}`,
      t1:ts[p[0]].f, n1:ts[p[0]].n,
      t2:ts[p[1]].f, n2:ts[p[1]].n,
      date:base[g][i], time:times[i]
    }));
  });
  return res;
}

const MATCHES_GROUP = makeGroupMatches();

// Knockout phase matches (initially empty, filled by admin)
const KNOCKOUT_TEMPLATES = {


  1: Array.from({length:16},(_,i)=>({id:`R16_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-06-29',time:'18:00',locked:true})),
  2: Array.from({length:8},(_,i)=>({id:`QF_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-04',time:'18:00',locked:true})),
  3: Array.from({length:4},(_,i)=>({id:`SF_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-14',time:'18:00',locked:true})),
  4: [{id:'FIN_1',n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-19',time:'18:00',locked:true}]
};

let S = {
  users: JSON.parse(localStorage.getItem('wf26_users')||'{}'),
  leagues: JSON.parse(localStorage.getItem('wf26_leagues')||'{}'),
  predictions: JSON.parse(localStorage.getItem('wf26_preds')||'{}'),
  results: JSON.parse(localStorage.getItem('wf26_results')||'{}'),
  schedule: JSON.parse(localStorage.getItem('wf26_sched')||'{}'),
  knockoutMatches: JSON.parse(localStorage.getItem('wf26_ko')||'{}'),
  currentUser: localStorage.getItem('wf26_cu')||null,
  currentPhase: 0,
  currentGroup: 'A',
  currentLeague: null,
  currentRankPhase: 'total'
};

async function refreshUserLeagues(){
  try{
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    // Como tu doc users/{uid} no tiene `leagues`, recuperamos por cada league documentando miembros
    // (para pruebas, hacemos consulta dirigida por miembros consultando 1 vez por liga desde localStorage no aplica).
    // Solución de prueba: listar todas las ligas y filtrar por members.
    const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const all = await getDocs(collection(fbDb(), 'leagues'));
    const owned=[];
    all.forEach(d=>{
      const data=d.data()||{};
      const mem=data.members||[];
      if(mem.includes(S.currentUser)) owned.push(d.id);
    });

    // Cargar en memoria S.leagues
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
  // En modo completo: solo dejamos en localStorage lo “cacheable” (usuarios/ligas).
  // Predicciones y resultados van a Firestore.
  localStorage.setItem('wf26_users',JSON.stringify(S.users));
  localStorage.setItem('wf26_leagues',JSON.stringify(S.leagues));
}


// Roles
const getCurrentUserEmail = () => {
  try {
    const u = S.users?.[S.currentUser];
    return (u?.username || '').trim();
  } catch {
    return '';
  }
};

// Admin total (global)
const isTotalAdmin = () => {
  const email = getCurrentUserEmail();
  return email && String(email).toLowerCase() === String(ADMIN_EMAIL).toLowerCase();
};

// Admin de liga (solo creador de esa liga)
const isLeagueAdminForCurrentLeague = () => {
  try {
    if (!S.currentLeague) return false;
    const l = S.leagues?.[S.currentLeague];
    if (!l) return false;
    return String(l.creatorUid) === String(S.currentUser);
  } catch {
    return false;
  }
};

// ===== AUTH =====
function switchAuthTab(t){
  try{
    document.querySelectorAll('.auth-tab').forEach((el,i)=>el.classList.toggle('active',i===(t==='login'?0:1)));
    const lf=document.getElementById('login-form');
    const rf=document.getElementById('register-form');
    if(lf) lf.style.display=t==='login'?'block':'none';
    if(rf) rf.style.display=t==='register'?'block':'none';
    const le=document.getElementById('login-err');
    const re=document.getElementById('reg-err');
    if(le) le.textContent='';
    if(re) re.textContent='';
  }catch(e){
    console.error('switchAuthTab error',e);
  }
}

// ===== AUTH (Firebase) =====
async function doLogin(){
  try{
    const email=document.getElementById('login-email').value.trim();
    const pass=document.getElementById('login-pass').value;
    const errEl=document.getElementById('login-err');

    if(!email||!pass){ errEl.textContent='Completa email y contraseña'; return; }

    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    const res = await signInWithEmailAndPassword(fbAuth(), email, pass);


    // login-user se ignora (opción 1)
    const uid = res.user.uid;
    S.currentUser = uid;
    localStorage.setItem('wf26_cu', uid);

    // Cargar perfil (username) desde Firestore
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');

    const snap = await getDoc(doc(fbDb(), 'users', uid));

    S.users = S.users || {};
    if(snap.exists()){
      S.users[uid] = { username: snap.data().username || '', avatar: snap.data().avatarUrl || null };
    }

    showMain();
  }catch(e){
    console.error('doLogin error', e);
    const msg = (e && e.message) ? e.message : String(e);
    document.getElementById('login-err').textContent = 'Error al iniciar sesión: ' + msg;
  }
}


async function doRegister(){
  try{
    const email=document.getElementById('reg-email').value.trim();
    const pass=document.getElementById('reg-pass').value;
    const err=document.getElementById('reg-err');

    if(!email||!pass){ err.textContent='Completa email y contraseña'; return; }
    if(pass.length<4){ err.textContent='Mínimo 4 caracteres'; return; }

    if(!fbAuth() || !fbDb()){
      err.textContent = 'Firebase no está inicializado';
      console.error('fbAuth/fbDb missing', { fbAuth: !!fbAuth(), fbDb: !!fbDb() });
      return;
    }

    const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    const res = await createUserWithEmailAndPassword(fbAuth(), email, pass);


    const uid = res.user.uid;

    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    await setDoc(doc(fbDb(), 'users', uid), {

      username: email,
      avatarUrl: null,
      createdAt: Date.now()
    }, { merge: true });

    S.currentUser = uid;
    localStorage.setItem('wf26_cu', uid);
    S.users = S.users || {};
    S.users[uid] = { username: email, avatar: null };

    showMain();
  }catch(e){
    // Mostrar el error real para que veas si es por reglas, email inválido, auth disabled, etc.
    console.error('doRegister error', e);
    const msg = (e && e.message) ? e.message : String(e);
    document.getElementById('reg-err').textContent = 'Error al crear cuenta: ' + msg;
  }
}



async function doLogout(){
  try{
    const { signOut } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js');
    if(fbAuth()) await signOut(fbAuth());

  }finally{
    S.currentUser=null;
    localStorage.removeItem('wf26_cu');
    document.getElementById('main-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('active');
    switchAuthTab('login');
    const lu = document.getElementById('login-user');
    if(lu) lu.value='';

    document.getElementById('login-email').value='';
    document.getElementById('login-pass').value='';
  }
}
const RESULTS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzFtr_v_UbmNoS-7vtlaqFz2ObHyYFmMBXK6WGH2fygBkGeu8ywgbIJ0slk9EaVEs9Xfg/exec'; // actualizado al deployment del doGet nuevo
let autoResultsTimer = null;

async function fetchResultsFromSheet(){
  try{
    const r = await fetch(RESULTS_ENDPOINT, { cache: 'no-store' });
    const data = await r.json();
    const resultsMap = data?.results || {};
    const next = {};
    Object.keys(resultsMap).forEach(mid=>{
      const it = resultsMap[mid] || {};
      const g1 = it.g1;
      const g2 = it.g2;
      if(g1 === null || g1 === undefined || g2 === null || g2 === undefined) return;
      next[mid] = { g1: Number(g1), g2: Number(g2) };
    });
    return next;
  }catch(e){
    console.error('fetchResultsFromSheet error', e);
    return null;
  }
}

async function startAutoUpdateResults(){
  // NOTA: en modo completo, los resultados del endpoint se escriben también a Firestore
  // para que predicciones/ranking dependan de un estado compartido.

  try{
    console.log('[wf26] startAutoUpdateResults');
  }catch(e){}

  console.log('[wf26] startAutoUpdateResults');
  // evita múltiples intervals
  if(autoResultsTimer) clearInterval(autoResultsTimer);

  // refresco inmediato
  const first = await fetchResultsFromSheet();
  if(first){
    S.results = first;
    save();
    renderPredTab();
    renderRanking();
    renderPhaseBody();
  }

  autoResultsTimer = setInterval(async ()=>{
    const next = await fetchResultsFromSheet();
    if(!next) return;

    const prev = S.results || {};
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    const changed = prevKeys.length !== nextKeys.length || nextKeys.some(mid=>{
      const a = next[mid] || {};
      const b = prev[mid] || {};
      return Number(a.g1) !== Number(b.g1) || Number(a.g2) !== Number(b.g2);
    });

    if(!changed) return;

    S.results = next;
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
  goTab('ligas',0); renderProfileInfo();
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
    const { doc, setDoc, arrayUnion } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');

    // Crear doc de liga en Firestore
    await setDoc(doc(fbDb(), 'leagues', code), {
      name,
      avatar: pendingAvatar || null,
      code,
      members: [S.currentUser],
      creatorUid: S.currentUser,
      createdAt: Date.now()
    }, { merge: false });

    // (Opcional) marcar en users/{uid} un índice de ligas si existe la estructura.
    // En tu caso el campo `leagues` no existe, así que lo dejamos sin tocar.

    // Refrescar memoria
    S.currentLeague = code;
    S.leagues = S.leagues || {};
    S.leagues[code] = { name, avatar: pendingAvatar || null, code, members: [S.currentUser], creatorUid: S.currentUser, createdAt: Date.now() };

    document.getElementById('modal-content').innerHTML=`<div class="modal-title">✅ Liga creada</div>
    <p style="font-size:12px;color:var(--text2);margin-bottom:14px">Comparte este código con tus amigos:</p>
    <div class="code-display"><div class="code-text">${code}</div><div class="code-label">Código único de la liga</div></div>
    <button class="btn-copy" onclick="copyCode('${code}')">📋 Copiar código</button>
    <div class="msg-ok" id="copy-ok"></div>
    <button class="btn-primary" style="margin-top:14px" onclick="closeModal();renderLeagues()">Continuar</button>`;
  }catch(e){
    console.error('createLeague error', e);
    document.getElementById('create-err').textContent='Error al crear liga: ' + (e?.message || String(e));
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
    if(!snap.exists()){
      err.textContent='❌ Liga no encontrada. Code usado: ' + code;
      console.log('joinLeague: league not found. code=', code);
      return;
    }
    const l = snap.data();

    // update members (arrayUnion evita duplicados)
    await updateDoc(doc(fbDb(), 'leagues', code), {
      members: arrayUnion(S.currentUser)
    });

    // Guardar índice en users/{uid} para listar rápidamente
    await updateDoc(doc(fbDb(), 'users', S.currentUser), {
      leagues: arrayUnion(code)
    });

    // Refrescar datos en memoria
    S.currentLeague = code;
    await refreshUserLeagues();

    document.getElementById('modal-content').innerHTML=`<div class="modal-title">🎉 ¡Bienvenido!</div><p style="font-size:13px;color:var(--text2);margin-bottom:16px">Ahora eres miembro de <strong style="color:var(--text)">${l.name || 'Liga'}</strong></p><button class="btn-primary" onclick="closeModal();renderLeagues()">Ver ligas</button>`;
  }catch(e){
    console.error('joinLeague error', e);
    err.textContent='Error al unirse: ' + (e?.message || String(e));
  }
}
function closeModal(){ document.getElementById('modal-overlay').style.display='none'; pendingAvatar=null; }
function closeModalBg(e){ if(e.target===document.getElementById('modal-overlay')) closeModal(); }

function renderLeagues(){
  const list=document.getElementById('leagues-list');
  if(!list) return;

  const leaguesCodes = Object.keys(S.leagues || {}).filter(c => S.leagues[c]);

  // Mantener coherencia con el requisito: si el usuario ya estaba en ligas,
  // NO deben desaparecer tras recargar.
  // Si S.leagues aún no terminó de refrescar, mostramos lo que ya exista en cache.
  if(!leaguesCodes.length){
    const cached = JSON.parse(localStorage.getItem('wf26_leagues')||'{}');
    const cachedCodes = Object.keys(cached||{}).filter(c => cached[c]);
    if(cachedCodes.length){
      S.leagues = cached;
      return renderLeagues();
    }
    list.innerHTML=`<div class="empty-state"><div class="ei">🏆</div><p>Aún no tienes ligas.<br>¡Crea una o únete!</p></div>`; 
    return;
  }

  list.innerHTML=leaguesCodes.map(code=>{
    const l=S.leagues[code];
    const pts=getUserPts(S.currentUser,code,'total');
    let av=l.avatar?`<img src="${l.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span style="font-size:18px">🏆</span>`;
    const isSelected=S.currentLeague===code;
    return `<div class="league-card${isSelected?' selected':''}" onclick="selectLeague('${code}')">
      <div class="league-avatar">${av}</div>
      <div class="league-info"><div class="league-name">${l.name}</div><div class="league-meta">${l.members.length} miembros · ${code}</div></div>
      <div style="text-align:right"><div style="font-size:20px;font-weight:700;color:var(--gold)">${pts}</div><div style="font-size:10px;color:var(--text2)">pts</div></div>
    </div>`;
  }).join('');
}


function selectLeague(code){
  S.currentLeague=code;
  renderLeagues();
}

// ===== PREDICCIONES =====
function pickLeagueForPreds(code){
  S.currentLeague=code; closeModal(); renderPredTab();
}

function renderPredTab(){
  const inner=document.getElementById('pred-inner');
  if(!inner){
    console.error('renderPredTab: pred-inner missing');
    return;
  }
  const ul=Object.keys(S.leagues||{}).filter(c=>S.leagues[c]);
  if(!ul.length){ inner.innerHTML=`<div class="no-league-banner">Únete o crea una <span>liga</span> para hacer predicciones</div>`; return; }

  if(!S.currentLeague||!S.leagues[S.currentLeague]){
    const l=S.leagues[ul[0]];
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
  // sd.time ya viene en hora de España; evitamos que el navegador la interprete en otra zona horaria.
  // Construimos la fecha como "local" para que HH:MM se mantenga.
  const matchDtParts = (sd?.date || m.date).split('-');
  const [Y, M, D] = matchDtParts;
  const [hh, mm] = (sd?.time || m.time).split(':');
  const matchDt = new Date(Number(Y), Number(M)-1, Number(D), Number(hh), Number(mm), 0);
  const closeDt=new Date(matchDt.getTime()-5*60*1000);
  const now=new Date();
  const locked=now>=closeDt || m.locked;
  const res=S.results[m.id];
  const finished=!!res;
  const lockStr=locked?(finished?'✅ Finalizado':'🔒 Cerrado'):`⏰ Cierre: ${fmtTime(closeDt)}`;
  
  let resultRow='';
  if(finished){
    const myPts=calcPoints(res,p);
    resultRow=`<div class="result-row">
      <span class="result-real">Real: ${res.g1} - ${res.g2}</span>
      <span class="result-pred">Tu pred: ${p.g1!==''?p.g1:'?'} - ${p.g2!==''?p.g2:'?'}</span>
      <span class="result-pts">+${myPts} pts</span>
    </div>`;
    
    // Rivals view
    if(S.currentLeague){
      const league=S.leagues[S.currentLeague];
      const rivalsData=league.members.filter(mb=>mb!==S.currentUser).map(mb=>{
        const rp=((S.predictions[S.currentLeague]||{})[mb])||{};
        const rpr=rp[m.id]||{g1:'',g2:''};
        const rpts=calcPoints(res,rpr);
        return `<div class="rival-row"><span class="rival-name">${mb}</span><span class="rival-pred">${rpr.g1!==''?rpr.g1:'?'} - ${rpr.g2!==''?rpr.g2:'?'}</span><span class="rival-pts">+${rpts}</span></div>`;
      }).join('');
      if(rivalsData) resultRow+=`<button class="rivals-btn" onclick="toggleRivals('${m.id}')">👥 Ver predicciones rivales</button><div class="rivals-panel" id="rv-${m.id}">${rivalsData}</div>`;
    }
  }

  let adminRow='';
if(isTotalAdmin()){
    const rg1=res?res.g1:'';const rg2=res?res.g2:'';
    adminRow=`<div class="admin-row">
      <span style="font-size:10px;color:var(--admin);font-weight:700">ADMIN:</span>
      <input class="admin-input" id="adm-${m.id}-1" type="number" min="0" max="20" value="${rg1}" placeholder="?">
      <span style="font-size:11px;color:var(--text3)">-</span>
      <input class="admin-input" id="adm-${m.id}-2" type="number" min="0" max="20" value="${rg2}" placeholder="?">
      <button class="btn-admin" onclick="adminSetResult('${m.id}')">Guardar</button>
      ${finished?`<button class="btn-admin" onclick="adminRecalc('${m.id}')" style="border-color:var(--success);color:var(--success)">Recalc</button>`:''}
    </div>`;
  }

  return `<div class="match-card${finished?' finished':''}" id="mc-${m.id}">

    <div class="match-row">
      <div class="team-side">
        <span class="team-flag">${m.t1}</span>
        <span class="team-name">${m.n1}</span>
        <input class="score-input" type="number" min="0" max="20" value="${p.g1}" id="pred-${m.id}-1" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>

      <span class="score-sep"> - </span>

      <div class="team-side right">
        <span class="team-flag">${m.t2}</span>
        <span class="team-name">${m.n2}</span>
        <input class="score-input" type="number" min="0" max="20" value="${p.g2}" id="pred-${m.id}-2" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
    </div>
    <div class="match-meta"><span>📅 ${fmtDate(m.date)} ${m.time}</span><span>${lockStr}</span></div>
    ${resultRow}${adminRow}
  </div>`;
}

function toggleRivals(mid){
  const el=document.getElementById('rv-'+mid); if(!el) return;
  el.classList.toggle('open');
}

async function savePred(mid){
  if(!S.currentLeague) return;

  clearTimeout(saveTimers[mid]);
  saveTimers[mid]=setTimeout(async ()=>{
    const g1=document.getElementById('pred-'+mid+'-1')?.value||'';
    const g2=document.getElementById('pred-'+mid+'-2')?.value||'';

    try{
      const { doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
      // leemos el doc para actualizar el matchId manteniendo otros partidos
      const predRef = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', S.currentUser);
      const snap = await getDoc(predRef);
      const existing = snap.exists()? (snap.data()||{}) : {};
      const next = { ...existing, [mid]: { g1, g2 } };
      await setDoc(predRef, next, { merge: false });

      const ind=document.getElementById('save-ind');
      if(ind){ind.textContent='✅ Guardado';setTimeout(()=>{if(ind)ind.textContent='';},1800);}

      // refrescar en memoria para pintar inmediatamente
      if(!S.predictions[S.currentLeague]) S.predictions[S.currentLeague]={};
      S.predictions[S.currentLeague][S.currentUser] = next;
    }catch(e){
      console.error('savePred error', e);
    }
  },700);
}


async function adminSetResult(mid){
  const g1=document.getElementById('adm-'+mid+'-1')?.value;
  const g2=document.getElementById('adm-'+mid+'-2')?.value;
  if(g1===''||g2==='') return;
  if(!S.currentLeague) return;

  try{
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const rg = { g1: parseInt(g1), g2: parseInt(g2) };
    // Guardar resultado por partido
    await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'results', mid), rg, { merge: true });

    // Recalcular puntos de TODOS los miembros en predictions/{uid}
    const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const predCol = collection(fbDb(), 'leagues', S.currentLeague, 'predictions');
    const predSnaps = await getDocs(predCol);

    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid = dSnap.id;
      const data = dSnap.data()||{};
      const p = data[mid] || { g1:'', g2:'' };
      const pts = calcPoints(rg, p);
      const next = { ...data, [mid]: { ...p, points: pts } };
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), next, { merge:false });
    }));

    // Refrescar en memoria para pintar
    S.results[mid] = rg;
    renderPhaseBody();
  }catch(e){
    console.error('adminSetResult error', e);
  }
}


async function adminRecalc(mid){
  if(!S.currentLeague) return;
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const resSnap = await getDoc(doc(fbDb(), 'leagues', S.currentLeague, 'results', mid));
    if(!resSnap.exists()) return;
    const rg = resSnap.data()||{};

    const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const predCol = collection(fbDb(), 'leagues', S.currentLeague, 'predictions');
    const predSnaps = await getDocs(predCol);

    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid = dSnap.id;
      const data = dSnap.data()||{};
      const p = data[mid] || { g1:'', g2:'' };
      const pts = calcPoints(rg, p);
      const next = { ...data, [mid]: { ...p, points: pts } };
      await setDoc(doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid), next, { merge:false });
    }));

    renderPhaseBody();
    const ind=document.getElementById('save-ind');
    if(ind){ind.textContent='✅ Puntos recalculados';setTimeout(()=>{if(ind)ind.textContent='';},2000);}
  }catch(e){
    console.error('adminRecalc error', e);
  }
}


function calcPoints(res, pred){
  if(!res) return 0;
  const rg1=parseInt(res.g1), rg2=parseInt(res.g2);
  const pg1=pred.g1!==''&&pred.g1!==undefined&&pred.g1!==null?parseInt(pred.g1):null;
  const pg2=pred.g2!==''&&pred.g2!==undefined&&pred.g2!==null?parseInt(pred.g2):null;
  const exacto=pg1===rg1&&pg2===rg2;
  if(exacto) return 25;
  const realWinner = rg1>rg2?1:rg2>rg1?2:0;
  const predWinner = pg1!==null&&pg2!==null?(pg1>pg2?1:pg2>pg1?2:0):null;
  const acertaGanador = predWinner!==null && predWinner===realWinner;
  const acertaG1=pg1===rg1, acertaG2=pg2===rg2;
  const acertaAlgunGol=acertaG1||acertaG2;
  if(acertaAlgunGol&&acertaGanador) return 11;
  if(!acertaAlgunGol&&acertaGanador) return 5;
  if(acertaAlgunGol&&!acertaGanador) return 4;
  return 0;
}

// ===== RANKING =====
function getUserPts(user, leagueCode, phase){
  if(!S.predictions[leagueCode]||!S.predictions[leagueCode][user]) return 0;
  const up=S.predictions[leagueCode][user];
  return Object.values(up).reduce((acc,p)=>acc+(p.points||0),0);
}

function renderRanking(){
  const ul=S.users[S.currentUser]?.leagues||[];
  const filtersEl=document.getElementById('ranking-filters');
  filtersEl.innerHTML=['Total',...PHASES].map((f,i)=>{
    const fv=i===0?'total':i-1;
    return `<div class="filter-btn${S.currentRankPhase===fv?' active':''}" onclick="setRankPhase(${i===0?"'total'":i-1})">${f}</div>`;
  }).join('');
  const listEl=document.getElementById('ranking-list');
  if(!ul.length){listEl.innerHTML=`<div class="empty-state"><div class="ei">📊</div><p>Únete a una liga para ver la tabla</p></div>`;return;}
  let html='';
  ul.filter(c=>S.leagues[c]).forEach(code=>{
    const l=S.leagues[code];
    const scores=l.members.map(m=>({m,pts:getUserPts(m,code,S.currentRankPhase),user:S.users[m]}));
    scores.sort((a,b)=>b.pts-a.pts);
    html+=`<div class="rank-league-label">${l.name}</div>`;
    scores.forEach((s,i)=>{
      const posC=i===0?'gold':i===1?'silver':i===2?'bronze':'';
      const posI=i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;
      const isMe=s.m===S.currentUser;
      let av=s.user?.avatar?`<img src="${s.user.avatar}">`:`<span style="font-size:16px">😎</span>`;
      html+=`<div class="rank-item${isMe?' me':''}"><div class="rank-pos ${posC}">${posI}</div><div class="rank-avatar">${av}</div><div class="rank-name">${s.m}${isMe?' (Tú)':''}</div><div class="rank-pts">${s.pts}</div></div>`;
    });
  });
  listEl.innerHTML=html;
}

function setRankPhase(f){ S.currentRankPhase=f; renderRanking(); }

// ===== INFO =====
function renderProfileInfo(){
  const el=document.getElementById('profile-username-display');
if(el) el.textContent=S.currentUser+(isTotalAdmin()?' 👑':'');
  const ab=document.getElementById('profile-avatar-big');
  if(ab){
    const ua=S.users[S.currentUser]?.avatar;
    const em=document.getElementById('profile-avatar-emoji');
    if(ua){ if(em) em.style.display='none'; let img=ab.querySelector('img.pi');if(!img){img=document.createElement('img');img.className='pi';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;';ab.appendChild(img);}img.src=ua;}
  }
}

function updateProfilePic(input){
  if(!input.files[0]) return;
  const r=new FileReader(); r.onload=e=>{S.users[S.currentUser].avatar=e.target.result;save();renderProfileInfo();}; r.readAsDataURL(input.files[0]);
}

// ===== UTILS =====
function fmtDate(d){ const[y,m,dd]=d.split('-');const ms=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];return`${parseInt(dd)} ${ms[parseInt(m)-1]}`; }
function fmtTime(dt){ return dt.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}); }

// Init
if(S.currentUser && S.users[S.currentUser]) showMain();


