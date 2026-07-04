// ===== DATA =====
const PHASES = ['Fase de Grupos','Dieciseisavos de Final','Octavos de Final','Cuartos de Final','Semifinales','3er y 4to Puesto','Final'];
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const ADMIN_RESULT_DEFAULTS = {
  exact: 7,
  winnerNoGoals: 2,
  winnerAndOneTeamGoals: 4,
  oneTeamGoalsNoExact: 1
};

const ADMIN_EMAILS = ['a24gabrieldg@iesantonlosada.gal', 'gabidubrag@gmail.com'];
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

// Generado una sola vez para evitar regenerarlo en cada tarjeta de partido KO
const KO_TEAM_OPTIONS_HTML = '<option value="">— Equipo —</option>' +
  ALL_TEAMS.map(t => `<option value="${t.n}">${t.f} ${t.n}</option>`).join('');

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

// Bracket real de 32 equipos clasificados a eliminatorias (48 equipos, top2 + 8 mejores 3os):
// Dieciseisavos (32→16, 16 partidos) → Octavos (16→8, 8 partidos) → Cuartos (8→4, 4 partidos)
// → Semifinales (4→2, 2 partidos) → 3er y 4to puesto (1 partido) → Final (1 partido).
// IMPORTANTE: cada fase tiene su PROPIO número de fase incrustado en el prefijo del id
// (KO1_, KO2_, KO3_, KO4_, KO5_, KO6_). Antes los prefijos eran genéricos (R16_, QF_, SF_...)
// y no llevaban el número de fase, así que si un cruce se guardaba mal en la fase
// equivocada (p.ej. por un bug de posición/índice), podía terminar con el mismo id que
// un partido real de OTRA fase — y como el id es la clave de guardado, los dos partidos
// pasaban a compartir resultado y predicciones. Con el número de fase dentro del propio
// id, un partido de Octavos JAMÁS puede tener el mismo id que uno de Dieciseisavos,
// aunque los datos guardados estén corruptos o desordenados: cada botón/casilla de cada
// partido de cada fase es único de verdad.
const KNOCKOUT_TEMPLATES = {
  1: Array.from({length:16},(_,i)=>({id:`KO1_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-04',time:'18:00',locked:true})),
  2: Array.from({length:8},(_,i)=>({id:`KO2_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-11',time:'18:00',locked:true})),
  3: Array.from({length:4},(_,i)=>({id:`KO3_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-14',time:'18:00',locked:true})),
  4: Array.from({length:2},(_,i)=>({id:`KO4_${i+1}`,n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-15',time:'18:00',locked:true})),
  5: [{id:'KO5_1',n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-18',time:'18:00',locked:true}],
  6: [{id:'KO6_1',n1:'Por definir',n2:'Por definir',t1:'❓',t2:'❓',date:'2026-07-19',time:'18:00',locked:true}]
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
  // partidos vetados por admin (resultado borrado manualmente)
  vetoed: JSON.parse(localStorage.getItem('wf26_vetoed')||'{}'),
  // partidos eliminados por completo por el admin (no se muestran en ninguna vista) { [mid]: true }
  deletedMatches: JSON.parse(localStorage.getItem('wf26_deleted_matches')||'{}'),
  // partidos añadidos manualmente por el admin, agrupados por grupo { [group]: [match, ...] }
  customMatches: JSON.parse(localStorage.getItem('wf26_custom_matches')||'{}'),
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
  localStorage.setItem('wf26_deleted_matches',JSON.stringify(S.deletedMatches||{}));
  localStorage.setItem('wf26_custom_matches',JSON.stringify(S.customMatches||{}));
}

// Devuelve los partidos "reales" de un grupo: los de calendario oficial + los añadidos por el
// admin para ese grupo, excluyendo cualquier partido marcado como eliminado por el admin.
// Usar SIEMPRE esta función (en vez de MATCHES_GROUP[g] directamente) para listar partidos de un grupo.
function getGroupMatches(g){
  const base = MATCHES_GROUP[g] || [];
  const custom = (S.customMatches && S.customMatches[g]) || [];
  const all = [...base, ...custom];
  return all.filter(m => !(S.deletedMatches && S.deletedMatches[m.id]));
}

// Normaliza el array de partidos de una fase KO a la longitud fija de su plantilla
// (KNOCKOUT_TEMPLATES), asignando siempre el id canónico por posición.
// Si el array guardado tiene MÁS partidos de los que le tocan a esa fase (por
// corrupción antigua: partidos acumulados en el sitio equivocado), no se recorta a lo
// bruto por orden de array — eso podía cortar justo los cruces que el admin ya había
// configurado (con equipos reales) si quedaban "detrás" de partidos placeholder/basura,
// dejando "Por definir vs Por definir" en su lugar. En su lugar, se priorizan los
// partidos que YA tienen algún equipo definido, y solo se completa con placeholders si
// sobran huecos. Se usa la MISMA función al leer (getKOMatches) y al guardar
// (adminSetKnockoutTeams) para que la posición que ve y edita el admin sea siempre la
// misma que se graba.
function normalizeKOPhase(phase, rawArr){
  const template = KNOCKOUT_TEMPLATES[phase] || [];
  const raw = Array.isArray(rawArr) ? rawArr : [];
  let ordered;
  if(raw.length <= template.length){
    // Caso normal: no hay partidos "de más" en el array guardado, así que se respeta el
    // orden tal cual está. Esto es importante: si reordenáramos siempre (poniendo los
    // partidos con equipo definido primero), la posición -y por tanto el id- de un
    // partido placeholder cambiaría cada vez que se completara OTRO partido de la
    // misma fase, desestabilizando los ids con el tiempo en vez de arreglarlos.
    ordered = raw;
  } else {
    // Caso corrupto: el array tiene más partidos de los que le tocan a esta fase
    // (basura acumulada de un bug antiguo). Aquí sí hace falta un criterio de rescate:
    // se prioriza conservar los partidos que YA tienen algún equipo definido, para no
    // perderlos si quedaban "detrás" de partidos placeholder en el array. Una vez el
    // admin vuelva a guardar un cruce de esta fase, el array queda recortado a la
    // longitud correcta y a partir de ahí ya no vuelve a entrar por esta rama.
    const hasTeams = (m) => m && ((m.n1 && m.n1 !== 'Por definir') || (m.n2 && m.n2 !== 'Por definir'));
    const withTeams = raw.filter(hasTeams);
    const placeholders = raw.filter(m => !hasTeams(m));
    ordered = [...withTeams, ...placeholders];
  }
  ordered = ordered.slice(0, template.length);
  return template.map((t,i)=>({ ...t, ...(ordered[i]||{}), id: t.id }));
}

// Devuelve los partidos de una fase KO excluyendo los eliminados por el admin.
// El id de cada partido es SIEMPRE el canónico de su fase+posición (ver normalizeKOPhase
// arriba), nunca el que viniera guardado en Firestore, para que dos partidos de fases
// distintas no puedan compartir id (y por tanto resultado/predicciones) pase lo que pase
// con los datos guardados.
function getKOMatches(phase){
  const normalized = normalizeKOPhase(phase, S.knockoutMatches[phase] || KNOCKOUT_TEMPLATES[phase]);
  return normalized.filter(m => !(S.deletedMatches && S.deletedMatches[m.id]));
}

const getCurrentUserEmail = () => {
  // Fuente de verdad: el email real de la sesión de Firebase Auth (igual que comprueban
  // las reglas de Firestore con request.auth.token.email). Antes se usaba el campo
  // 'username' guardado en Firestore, que puede desincronizarse del email real de login
  // y causar que isTotalAdmin() falle aunque ADMIN_EMAILS esté bien configurado.
  try {
    const authEmail = fbAuth()?.currentUser?.email;
    if (authEmail) return authEmail.trim();
  } catch {}
  // Fallback por si Auth aún no está listo en el primer render
  try { return (S.users?.[S.currentUser]?.username || '').trim(); } catch { return ''; }
};
const isTotalAdmin = () => {
  const email = getCurrentUserEmail();
  if(!email) return false;
  const lower = String(email).toLowerCase();
  return ADMIN_EMAILS.some(a => String(a).toLowerCase() === lower);
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

// NOTA: la API externa (Google Sheets) se ha eliminado por completo. Los resultados y horarios
// del torneo son EXCLUSIVAMENTE los que introduce el Admin Total desde esta app (guardados en
// Firestore, colección 'tournament'). Ningún resultado puede aparecer si el admin no lo ha fijado.

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
    const [schedSnap, koSnap, lockSnap, swapSnap, delSnap, customSnap] = await Promise.all([
      getDoc(doc(fbDb(), 'tournament', 'schedule_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'knockout_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'lock_overrides')),
      getDoc(doc(fbDb(), 'tournament', 'swapped_matches')),
      getDoc(doc(fbDb(), 'tournament', 'deleted_matches')),
      getDoc(doc(fbDb(), 'tournament', 'custom_matches'))
    ]);
    S.scheduleOverrides = schedSnap.exists() ? (schedSnap.data()||{}) : (S.scheduleOverrides||{});
    S.knockoutOverrides = koSnap.exists() ? (koSnap.data()||{}) : (S.knockoutOverrides||{});
    S.lockOverrides = lockSnap.exists() ? (lockSnap.data()||{}) : (S.lockOverrides||{});
    S.swappedMatches = swapSnap.exists() ? (swapSnap.data()||{}) : (S.swappedMatches||{});
    S.deletedMatches = delSnap.exists() ? (delSnap.data()||{}) : (S.deletedMatches||{});
    S.customMatches = customSnap.exists() ? (customSnap.data()||{}) : (S.customMatches||{});
    localStorage.setItem('wf26_sched_overrides', JSON.stringify(S.scheduleOverrides));
    localStorage.setItem('wf26_ko_overrides', JSON.stringify(S.knockoutOverrides));
    localStorage.setItem('wf26_lock_overrides', JSON.stringify(S.lockOverrides));
    localStorage.setItem('wf26_swapped', JSON.stringify(S.swappedMatches));
    localStorage.setItem('wf26_deleted_matches', JSON.stringify(S.deletedMatches));
    localStorage.setItem('wf26_custom_matches', JSON.stringify(S.customMatches));
  }catch(e){
    console.error('fetchTournamentOverrides error', e);
  }
}

// Admin: repara ids de cruces KO corruptos/duplicados entre fases.
// PROBLEMA DETECTADO: en 'tournament/knockout_overrides', algunos partidos de una fase
// quedaron guardados con un 'id' que coincide con el de un partido de OTRA fase
// (p.ej. un partido de Octavos guardado con id 'KO1_14' -antiguo esquema: 'R16_14'-, el mismo id que un partido
// real de Dieciseisavos — o al revés, un partido de Dieciseisavos guardado con un id
// de Octavos/Cuartos/etc). Como el 'id' es la clave que se usa para guardar resultados
// y predicciones, dos partidos con el mismo id comparten literalmente el mismo
// resultado: por eso parecía que "cambiar uno cambiaba el otro".
// Esta función reasigna, fase por fase (1 a 6, TODAS, sin dar ninguna por buena de
// antemano), el id de cada partido al id canónico que le corresponde en
// KNOCKOUT_TEMPLATES según su posición dentro de esa fase, dejando intactos los
// equipos (n1/n2/t1/t2) ya definidos.
// IMPORTANTE: si algún partido afectado ya tenía un resultado guardado bajo el id
// duplicado, ese resultado pertenece ambiguamente a AMBOS partidos que compartían el
// id, así que no se migra automáticamente (sería adivinar). Tras reparar, revisa y
// vuelve a introducir el resultado real de los partidos que hayan cambiado de id.
async function adminRepairKOIds(){
  if(!isTotalAdmin()) return;
  if(!confirm('Esto va a corregir los ids de los cruces de Dieciseisavos/Octavos/Cuartos/Semis/3-4º/Final que estén duplicados entre sí (aunque sean de fases distintas).\n\nSi algún partido afectado ya tenía resultado guardado, tendrás que volver a introducirlo después (no se puede migrar automáticamente porque el id estaba compartido con otro partido). ¿Continuar?')) return;
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'knockout_overrides');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const changes = []; // {phase, oldId, newId}
    const next = { ...existing };
    [1,2,3,4,5,6].forEach(phase=>{
      const arr = existing[phase];
      if(!Array.isArray(arr)) return;
      const template = KNOCKOUT_TEMPLATES[phase] || [];
      const fixedArr = arr.map((m,i)=>{
        const canonicalId = template[i]?.id;
        if(!canonicalId || m.id === canonicalId) return m;
        changes.push({ phase, oldId: m.id, newId: canonicalId });
        return { ...m, id: canonicalId };
      });
      next[phase] = fixedArr;
    });
    if(changes.length === 0){
      alert('No se ha encontrado ningún id duplicado/incorrecto entre fases eliminatorias. Si el problema persiste, dime exactamente qué id ves duplicado en el inspector.');
      return;
    }
    await setDoc(ref, next, { merge: false });
    S.knockoutOverrides = next;
    [1,2,3,4,5,6].forEach(phase=>{ if(next[phase]) S.knockoutMatches[phase] = next[phase]; });
    localStorage.setItem('wf26_ko_overrides', JSON.stringify(next));
    save();
    renderPhaseBody();
    const detail = changes.map(c=>`Fase ${c.phase}: ${c.oldId} → ${c.newId}`).join('\n');
    alert('Ids corregidos:\n\n'+detail+'\n\nRevisa estos partidos: si tenían resultado guardado, vuelve a introducirlo, porque ese resultado estaba compartido con el partido que tenía el mismo id.');
  }catch(e){
    console.error('adminRepairKOIds error', e);
    alert('Error al reparar: '+(e?.message||String(e)));
  }
}


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
    const template = KNOCKOUT_TEMPLATES[phase] || [];
    // La posición del partido dentro de la fase se resuelve SIEMPRE contra la plantilla
    // canónica (mid ya nos llega canónico porque la UI se pinta con getKOMatches, que
    // normaliza). Ya no se busca "mid" dentro del array guardado en Firestore: si ese
    // array estuviera corrupto (con ids repetidos o de otra fase), buscar por id ahí
    // podía no encontrar coincidencia y terminaba AÑADIENDO un partido nuevo en vez de
    // reemplazar el que tocaba, empeorando la corrupción con el tiempo.
    const idx = template.findIndex(t=>t.id===mid);
    if(idx===-1){ alert('Id de partido no reconocido: '+mid); return; }
    const existingArr = existing[phase] || [];
    // Reconstruye la fase ENTERA con longitud fija = la de la plantilla, forzando en cada
    // posición el id canónico correspondiente (auto-repara cualquier corrupción previa
    // en esa fase cada vez que el admin guarda un cruce). Se usa la MISMA normalización
    // (normalizeKOPhase) que pinta la UI (getKOMatches), para que la posición que el
    // admin acaba de editar sea exactamente la misma que se sobreescribe aquí.
    const normalizedPhase = normalizeKOPhase(phase, existingArr);
    normalizedPhase[idx] = { ...normalizedPhase[idx], n1, n2, t1, t2, id: template[idx].id };
    const next = { ...existing, [phase]: normalizedPhase };
    await setDoc(ref, next, { merge: false });
    S.knockoutOverrides = next;
    S.knockoutMatches[phase] = normalizedPhase;
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

    // 6) Partidos eliminados por el admin (se ocultan en cuanto se marcan, para todos)
    _unsubTournament.deleted = onSnapshot(
      doc(fbDb(), 'tournament', 'deleted_matches'),
      (snap) => {
        S.deletedMatches = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_deleted_matches', JSON.stringify(S.deletedMatches));
        save(); renderPhaseBody(); renderPredTab(); renderGruposTab();
      },
      (err) => console.error('onSnapshot deleted_matches error', err)
    );

    // 7) Partidos añadidos manualmente por el admin
    _unsubTournament.custom = onSnapshot(
      doc(fbDb(), 'tournament', 'custom_matches'),
      (snap) => {
        S.customMatches = snap.exists() ? (snap.data()||{}) : {};
        localStorage.setItem('wf26_custom_matches', JSON.stringify(S.customMatches));
        save(); renderPhaseBody(); renderPredTab(); renderGruposTab();
      },
      (err) => console.error('onSnapshot custom_matches error', err)
    );

  }).catch(e => console.error('startRealtimeTournament import error', e));
}

// Carga inicial de resultados/horarios/cruces + arranque de los listeners en tiempo real.
// IMPORTANTE: ya NO existe ninguna API externa de resultados. Los únicos resultados que
// puede ver cualquier usuario son los que el Admin Total ha introducido y guardado en
// Firestore ('tournament/results'). Sin admin no hay resultado, punto.
async function startAutoUpdateResults(){
  console.log('[wf26] startAutoUpdateResults');

  await Promise.all([fetchAdminResultsFromFirestore(), fetchTournamentOverrides()]);

  // El horario es siempre: fecha/hora base del partido, salvo que el admin la haya forzado
  S.schedule = { ...(S.scheduleOverrides||{}) };
  // Los resultados son EXCLUSIVAMENTE los del admin (adminResults ya excluye los vetados)
  S.results = { ...(S.adminResults||{}) };
  // Aplicar cruces de knockout definidos por admin
  Object.keys(S.knockoutOverrides||{}).forEach(phase=>{
    S.knockoutMatches[phase] = S.knockoutOverrides[phase];
  });
  save();
  renderPredTab();
  renderRanking();
  renderPhaseBody();

  // Listener en tiempo real: cualquier cambio del admin (resultado, horario, cruce, swap,
  // partido añadido/eliminado) se refleja al instante en todos los dispositivos, sin polling.
  startRealtimeTournament();
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
  const titles=['Mis Ligas','Predicciones','Grupos','Tabla','Información'];
  document.getElementById('top-bar-title').textContent=titles[idx];
  if(name==='ligas') renderLeagues();
  if(name==='preds') renderPredTab();
  if(name==='grupos') renderGruposTab();
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
  } else if(type==='add-match'){
    if(!isTotalAdmin()) return;
    const inputStyle='width:100%;padding:8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);font-size:13px';
    const groupOptionsHtml = GROUPS.map(g=>`<option value="${g}" ${g===S.currentGroup?'selected':''}>Grupo ${g}</option>`).join('');
    const deleted = getDeletedMatchesInfo(S.currentGroup);
    const deletedHtml = deleted.length ? `
      <div class="modal-field"><label>Partidos eliminados en Grupo ${S.currentGroup}</label>
        ${deleted.map(m=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:12px">
          <span>${m.t1} ${m.n1} - ${m.t2} ${m.n2}</span>
          <button class="btn-admin" onclick="adminRestoreMatch('${m.id}');openModal('add-match')" style="border-color:var(--success);color:var(--success)">↩ Restaurar</button>
        </div>`).join('')}
      </div>` : '';
    mc.innerHTML=`<div class="modal-title">➕ Añadir partido</div>
    <div class="modal-field"><label>Grupo</label><select id="adm-new-group" style="${inputStyle}">${groupOptionsHtml}</select></div>
    <div class="modal-field"><label>Equipo local</label><select id="adm-new-team1" style="${inputStyle}">${KO_TEAM_OPTIONS_HTML}</select></div>
    <div class="modal-field"><label>Equipo visitante</label><select id="adm-new-team2" style="${inputStyle}">${KO_TEAM_OPTIONS_HTML}</select></div>
    <div class="modal-field"><label>Fecha</label><input type="date" id="adm-new-date" style="${inputStyle}"></div>
    <div class="modal-field"><label>Hora</label><input type="time" id="adm-new-time" style="${inputStyle}"></div>
    <div class="modal-btns"><button class="btn-cancel" onclick="closeModal()">Cancelar</button><button class="btn-confirm" onclick="adminSaveNewMatch()">Guardar</button></div>
    <div class="msg-err" id="add-match-err"></div>
    ${deletedHtml}`;
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
function closeModal(){ document.getElementById('modal-overlay').style.display='none'; pendingAvatar=null; teardownCropDragHandlers(); }
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
      <button onclick="setPredViewMode('group')" style="flex:1;padding:9px 0;font-size:12px;font-weight:700;border:none;cursor:pointer;background:${!isDateView?'var(--primary)':'var(--bg2)'};color:${!isDateView?'#fff':'var(--text2)'};border-radius:0;transition:all .2s">Por fases</button>
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
    getGroupMatches(g).forEach(m => {
      const sd = S.schedule?.[m.id];
      const date = sd?.date || m.date;
      const time = sd?.time || m.time;
      allMatches.push({ ...m, _date: date, _time: time, _label: 'Grupo ' + g });
    });
  });

  // Fases eliminatorias (solo se incluyen si al menos un partido tiene equipos definidos)
  const koPhaseLabels = { 1:'Dieciseisavos de Final', 2:'Octavos de Final', 3:'Cuartos de Final', 4:'Semifinales', 5:'3er y 4to Puesto', 6:'Final' };
  [1,2,3,4,5,6].forEach(phase => {
    const koMatches = getKOMatches(phase);
    const phaseHasTeams = koMatches.some(m => m.n1 !== 'Por definir' || m.n2 !== 'Por definir');
    if(!phaseHasTeams) return; // No mostrar partidos sin equipos definidos en la vista por fecha
    koMatches.forEach(m => {
      if(m.n1 === 'Por definir' && m.n2 === 'Por definir') return; // saltar partidos sin equipos
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
    const koPhaseMap = {'Dieciseisavos de Final':1,'Octavos de Final':2,'Cuartos de Final':3,'Semifinales':4,'3er y 4to Puesto':5,'Final':6};
    const mKoPhase = koPhaseMap[m._label] || null;
    return matchCardHTML({ ...m, _phaseLabel: m._label }, preds, m._label !== 'Fase de Grupos', mKoPhase);
  }).join('');

  body.innerHTML = tabsHtml +
    `<div class="group-header" style="text-transform:capitalize">${dayHeaderLabel_(S.currentDateTab)}</div>` +
    listHtml +
    `<div class="save-indicator" id="save-ind"></div>`;

  // Centrar el tab del día seleccionado en la barra de scroll
  requestAnimationFrame(() => {
    const tabsEl = body.querySelector('.group-tabs');
    const activeTab = body.querySelector('.group-tab.active');
    if(tabsEl && activeTab){
      const tabsCenter = tabsEl.offsetWidth / 2;
      const activeCenter = activeTab.offsetLeft + activeTab.offsetWidth / 2;
      tabsEl.scrollLeft = activeCenter - tabsCenter;
    }
  });
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

function changePhase(d){ S.currentPhase=Math.max(0,Math.min(6,S.currentPhase+d)); renderPredTab(); }
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
  document.getElementById('phase-next').disabled=S.currentPhase===6;
  if(S.currentPhase===0){
    const tabsHtml=`<div class="group-tabs">${GROUPS.map(g=>`<div class="group-tab${g===S.currentGroup?' active':''}" onclick="selectGroup('${g}')">${g}</div>`).join('')}</div>`;
    body.innerHTML=tabsHtml+`<div id="gmatches"></div>`;
    renderGroupMatchList();
  } else {
    const unlockDates = ['','2026-07-04','2026-07-11','2026-07-14','2026-07-15','2026-07-18','2026-07-19'];
    const unlockDt=new Date(unlockDates[S.currentPhase]+'T00:00:00');
    const now=new Date(); const diff=unlockDt-now;
    const koMatches=getKOMatches(S.currentPhase);
    const allDefined=koMatches.some(m=>m.n1!=='Por definir');
    if(diff>0 && !allDefined && !isTotalAdmin()){
      const d=Math.floor(diff/(864e5)), h=Math.floor((diff%(864e5))/36e5);
      body.innerHTML=`<div class="lock-card"><div class="lock-icon">🔒</div><div class="lock-msg">${PHASES[S.currentPhase]}</div><div class="lock-time">${d}d ${h}h</div><div class="lock-sub">Se desbloquea cuando se conozcan los cruces</div></div>`;
      return;
    }
    const phaseHasAnyTeam = koMatches.some(m => m.n1 !== 'Por definir' || m.n2 !== 'Por definir');
    if(!phaseHasAnyTeam && !isTotalAdmin()){
      body.innerHTML=`<div class="lock-card"><div class="lock-icon">⏳</div><div class="lock-msg">${PHASES[S.currentPhase]}</div><div class="lock-sub">Los cruces se publicarán próximamente</div></div>`;
      return;
    }
    const repairBtn = isTotalAdmin()
      ? `<button class="btn-admin" style="width:100%;margin-bottom:8px;border-color:#f59e0b;color:#f59e0b" onclick="adminRepairKOIds()">🔧 Reparar ids de cruces (si dos partidos comparten resultado)</button>`
      : '';
    body.innerHTML=repairBtn+`<div id="ko-matches-list"></div>`;
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
  const matches=getGroupMatches(S.currentGroup);
  const preds=((S.predictions[S.currentLeague]||{})[S.currentUser])||{};
  const addBtn = isTotalAdmin() ? `<button class="btn-admin" style="width:100%;margin:6px 0 10px;border-color:var(--success);color:var(--success)" onclick="openModal('add-match')">➕ Añadir partido a este grupo</button>` : '';
  c.innerHTML=`<div class="group-header">Grupo ${S.currentGroup}</div>`+addBtn+matches.map(m=>matchCardHTML(m,preds,false,null)).join('')+`<div class="save-indicator" id="save-ind"></div>`;
}

function renderKOMatches(){
  const c=document.getElementById('ko-matches-list'); if(!c) return;
  const matches=getKOMatches(S.currentPhase);
  const preds=((S.predictions[S.currentLeague]||{})[S.currentUser])||{};
  // Ordenar por fecha y hora (usando override de S.schedule si existe, igual que en la vista por fecha)
  const sortedMatches = [...matches].sort((a,b)=>{
    const sa=S.schedule?.[a.id]; const sb=S.schedule?.[b.id];
    const da=(sa?.date||a.date)+'T'+(sa?.time||a.time);
    const db=(sb?.date||b.date)+'T'+(sb?.time||b.time);
    return da<db?-1:da>db?1:0;
  });
  c.innerHTML=sortedMatches.map(m=>matchCardHTML(m,preds,true,S.currentPhase)).join('')+`<div class="save-indicator" id="save-ind"></div>`;
  // Los selects de equipos se inyectan lazy en toggleKOEditSelects()
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
  const isR16 = String(m.id||'').startsWith('KO1_');

  // Aplicar swap si el admin lo ha marcado (intercambia local y visitante)
  const isSwapped = !!(S.swappedMatches?.[m.id]);
  const mDisplay = isSwapped
    ? { ...m, t1:m.t2, n1:m.n2, t2:m.t1, n2:m.n1 }
    : m;

  // Resultado real, invirtiendo g1/g2 si el partido está swapped
  const resRaw = S.results[m.id];
  const res = resRaw && isSwapped ? { ...resRaw, g1: resRaw.g2, g2: resRaw.g1 } : resRaw;
  const finished = !!res;

  const realDraw90 = isKnockout && finished && Number(res?.g1)===Number(res?.g2);
  const decidedBy = res?.decidedBy || null; // 'ET' | 'PEN'
  const realWinner = res?.r16_winner ? String(res.r16_winner) : null; // '1'|'2'

  const p=preds[m.id]||{g1:'',g2:''};

  // Si swapped, también invertir la predicción mostrada
  const pDisplay = isSwapped ? { ...p, g1: p.g2??'', g2: p.g1??'' } : p;
  const sd = S.schedule?.[m.id];
  const matchDtParts = (sd?.date||m.date).split('-');
  const [Y,M,D] = matchDtParts;
  const [hh,mm] = (sd?.time||m.time).split(':');
  const matchDt = new Date(Number(Y),Number(M)-1,Number(D),Number(hh),Number(mm),0);
  const closeDt=new Date(matchDt.getTime()-5*60*1000);
  const now=new Date();

  // Lógica de bloqueo (locked):
  // - Override '1' (admin cerró manualmente): cerrado sin excepción.
  // - Override '0' (admin abrió manualmente, ej. al fijar el cruce de un partido KO):
  //     - Si hay fecha/hora real del partido (sd en S.schedule): abierto hasta que llegue esa hora.
  //     - Si aún no hay fecha real: abierto (el admin lo abrió a propósito para que la gente prediga).
  // - Sin override: cerrado si now >= closeDt Y hay fecha real (sd), o por m.locked si no la hay.
  const lockOverrideVal = S.lockOverrides?.[m.id] ?? localStorage.getItem(`wf26_forced_lock_${m.id}`);
  const hasForcedLock = lockOverrideVal !== null && lockOverrideVal !== undefined;
  const hasRealDate = !!(sd?.date && sd?.time);
  const closedByTime = hasRealDate && now >= closeDt;
  let locked;
  if(hasForcedLock){
    if(lockOverrideVal === '1') locked = true;                    // cerrar forzado: siempre cerrado
    else locked = hasRealDate ? closedByTime : false;             // abrir forzado: respeta hora real si existe
  } else {
    locked = hasRealDate ? closedByTime : m.locked;              // sin override: tiempo real o placeholder
  }

  // Decider aparece cuando el usuario predice empate en KO (antes del partido) o el resultado real es empate
  const userPg1 = p.g1!==''&&p.g1!==undefined&&p.g1!==null ? parseInt(p.g1) : null;
  const userPg2 = p.g2!==''&&p.g2!==undefined&&p.g2!==null ? parseInt(p.g2) : null;
  const userPredictsDraw = isKnockout && !locked && userPg1!==null && userPg2!==null && userPg1===userPg2;

  // ===== KO decider UI =====
  // Editable solo mientras el partido no esté bloqueado. Una vez cerrado/finalizado,
  // se muestra en modo solo lectura (el usuario ya no puede cambiar quién pasa/cómo).
  const showR16Decider = isKnockout && (userPredictsDraw || (locked && realDraw90));
  const r16DeciderReadOnly = locked;
  const userWinner = p?.r16_winner || '';
  const userDecidedBy = p?.r16_decidedBy || '';
  const r16LocalActive = userWinner === '1' ? 'active' : '';
  const r16AwayActive = userWinner === '2' ? 'active' : '';
  const r16ETActive = userDecidedBy === 'ET' ? 'active' : '';
  const r16PENActive = userDecidedBy === 'PEN' ? 'active' : '';
  const r16RealText = decidedBy ? ` (${decidedBy === 'ET' ? 'Prórroga' : 'Penaltis'})` : '';
  const lockStr=locked?(finished?'✅ Finalizado':'🔒 Cerrado'):`⏰ Cierre: ${fmtTime(closeDt)}`;
  const showPredictionClosedUi = locked&&!finished;
  const predSmall = finished ? `<span class="pred-small">+${calcPoints(res,pDisplay,m.id)} pts</span>` : '';
  const predForUiClosed = p;

  let resultRow='';
  if(finished){
    const myPts=calcPoints(res,pDisplay,m.id);
    resultRow=`<div class="result-row">
      <span class="result-real">Real: ${res.g1} - ${res.g2}${(decidedBy && realDraw90)?(decidedBy==='ET'?' (Prórroga)':' (Penaltis)'):''}</span>
      <span class="result-pred">Tu pred: ${pDisplay.g1!==''?pDisplay.g1:'?'} - ${pDisplay.g2!==''?pDisplay.g2:'?'}</span>
      <span class="result-pts">+${myPts} pts</span>
    </div>`;

    if(S.currentLeague){
      const league=S.leagues[S.currentLeague];
      const rivalsData=league.members.filter(mb=>mb!==S.currentUser).map(mb=>{
        const rp=((S.predictions[S.currentLeague]||{})[mb])||{};
        const rpr=rp[m.id]||{g1:'',g2:''};
        const rprDisplay = isSwapped ? { g1: rpr.g2??'', g2: rpr.g1??'' } : rpr;
        const rpts=calcPoints(res,rprDisplay,m.id);

        // Si el rival predijo empate en un partido eliminatorio, mostrar la fase
        // (Prórroga/Penaltis) que eligió junto al resultado: a la izquierda si ganaba
        // el equipo local mostrado, a la derecha si ganaba el visitante mostrado.
        let phaseLeft = '', phaseRight = '';
        if(isKnockout){
          const rDraw = rprDisplay.g1!==''&&rprDisplay.g2!==''&&rprDisplay.g1!==undefined&&rprDisplay.g2!==undefined
            && Number(rprDisplay.g1)===Number(rprDisplay.g2);
          if(rDraw && rpr.r16_winner && rpr.r16_decidedBy){
            const phaseLabel = rpr.r16_decidedBy==='ET' ? 'Prórroga' : 'Penaltis';
            // rpr.r16_winner está en términos del partido original (sin swap); invertir si está swapped
            const winnerDisplaySide = isSwapped
              ? (rpr.r16_winner==='1' ? '2' : '1')
              : rpr.r16_winner;
            if(winnerDisplaySide==='1') phaseLeft = `<span class="rival-phase">${phaseLabel}</span> `;
            else if(winnerDisplaySide==='2') phaseRight = ` <span class="rival-phase">${phaseLabel}</span>`;
          }
        }

        return `<div class="rival-row"><span class="rival-name">${getDisplayName(mb)}</span><span class="rival-pred">${phaseLeft}${rprDisplay.g1!==''?rprDisplay.g1:'?'} - ${rprDisplay.g2!==''?rprDisplay.g2:'?'}${phaseRight}</span><span class="rival-pts">+${rpts}</span></div>`;
      }).join('');
      if(rivalsData) resultRow+=`<button class="rivals-btn" onclick="toggleRivals('${m.id}')">👥 Ver predicciones rivales</button><div class="rivals-panel" id="rv-${m.id}">${rivalsData}</div>`;
    }
  }

  let adminRow='';
  let adminR16Row='';
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

    // Si el partido es KO y el resultado guardado (g1/g2) es empate, el admin debe fijar quién pasó y cómo
    if(isKnockout && finished && realDraw90){
      const admR16WinnerLocalActive = String(realWinner)==='1' ? 'active' : '';
      const admR16WinnerAwayActive = String(realWinner)==='2' ? 'active' : '';
      const admDecidedByETActive = decidedBy==='ET' ? 'active' : '';
      const admDecidedByPENActive = decidedBy==='PEN' ? 'active' : '';
      adminR16Row=`<div class="admin-row" style="flex-wrap:wrap;gap:6px">
        <span style="font-size:10px;color:var(--admin);font-weight:700;width:100%">ADMIN — ¿Quién pasó? (empate ${rg1}-${rg2})</span>
        <button class="btn-admin ${admR16WinnerLocalActive}" onclick="adminSetR16Result('${m.id}','winner','1')" style="flex:1">${mDisplay.n1}</button>
        <button class="btn-admin ${admR16WinnerAwayActive}" onclick="adminSetR16Result('${m.id}','winner','2')" style="flex:1">${mDisplay.n2}</button>
        <span style="font-size:10px;color:var(--admin);font-weight:700;width:100%">¿Cómo?</span>
        <button class="btn-admin ${admDecidedByETActive}" onclick="adminSetR16Result('${m.id}','decidedBy','ET')" style="flex:1">Prórroga</button>
        <button class="btn-admin ${admDecidedByPENActive}" onclick="adminSetR16Result('${m.id}','decidedBy','PEN')" style="flex:1">Penaltis</button>
      </div>`;
    }
  }

  const adminLockControls = isTotalAdmin() ? `
    <div class="admin-lock-controls">
      <button class="btn-admin" onclick="adminClearResult('${m.id}')" style="border-color:#ef4444;color:#ef4444">Borrar resultado</button>
      <button class="btn-admin" onclick="adminSwapTeams('${m.id}')" style="border-color:#a78bfa;color:#a78bfa">${isSwapped?'↩ Deshacer swap':'🔄 Intercambiar'}</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','0')" style="border-color:var(--success);color:var(--success)">Reabrir</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','1')">Cerrar</button>
      <button class="btn-admin" onclick="forceToggleLock('${m.id}','clear')">Reset</button>
      <button class="btn-admin" onclick="adminDeleteMatch('${m.id}')" style="border-color:#ef4444;color:#ef4444">🗑️ Eliminar partido</button>
    </div>` : '';

  const adminScheduleRow = isTotalAdmin() ? `
    <div class="admin-row" style="flex-wrap:wrap">
      <span style="font-size:10px;color:var(--admin);font-weight:700">FECHA/HORA:</span>
      <input class="admin-input" id="adm-date-${m.id}" type="date" value="${sd?.date||m.date}" style="width:auto">
      <input class="admin-input" id="adm-time-${m.id}" type="time" value="${sd?.time||m.time}" style="width:auto">
      <button class="btn-admin" onclick="adminSetSchedule('${m.id}')">Guardar</button>
    </div>` : '';

  // El selector de equipos KO se inyecta al hacer clic en "Editar cruce" para evitar
  // renderizar 32×2×48 opciones de golpe (colapsa el navegador en la fase de dieciseisavos).
  const adminKnockoutRow = (isTotalAdmin() && isKnockout) ? `
    <div class="admin-row admin-ko-edit-row" id="adm-ko-row-${m.id}" style="flex-wrap:wrap;gap:6px">
      <button class="btn-admin" onclick="toggleKOEditSelects('${m.id}',${koPhase})" style="width:100%;font-size:10px">
        ✏️ Editar cruce: ${mDisplay.n1} vs ${mDisplay.n2}
      </button>
      <div id="adm-ko-selects-${m.id}" style="display:none;width:100%;display:none;flex-wrap:wrap;gap:6px"></div>
    </div>` : '';

  // Bloque KO decider: editable mientras el usuario predice empate y el partido sigue abierto.
  // Tras cerrarse (locked), se muestra en modo solo lectura con lo que el usuario predijo.
  const r16DeciderBlock = showR16Decider ? `
    <div class="r16-decider" id="r16d-${m.id}">
      <div class="r16-decider-label">${r16DeciderReadOnly ? 'Tu predicción: ¿quién pasaba?' : '¿Quién pasa en caso de empate?'}</div>
      <div class="r16-decider-row">
        <button class="r16-btn ${r16LocalActive}" ${r16DeciderReadOnly?'disabled':`onclick="saveR16Pred('${m.id}','winner','1')"`}>${mDisplay.n1}</button>
        <button class="r16-btn ${r16AwayActive}" ${r16DeciderReadOnly?'disabled':`onclick="saveR16Pred('${m.id}','winner','2')"`}>${mDisplay.n2}</button>
      </div>
      <div class="r16-decider-label" style="margin-top:8px">¿Cómo?${r16RealText}</div>
      <div class="r16-decider-row">
        <button class="r16-btn ${r16ETActive}" ${r16DeciderReadOnly?'disabled':`onclick="saveR16Pred('${m.id}','decidedBy','ET')"`}>Prórroga</button>
        <button class="r16-btn ${r16PENActive}" ${r16DeciderReadOnly?'disabled':`onclick="saveR16Pred('${m.id}','decidedBy','PEN')"`}>Penaltis</button>
      </div>
    </div>` : '';

  return `<div class="match-card${finished?' finished':''}" id="mc-${m.id}">
    <div class="match-row">
      <div class="team-side">
        <span class="team-flag">${mDisplay.t1}</span>
        <span class="team-name">${mDisplay.n1}</span>
        <input class="score-input" type="number" min="0" max="20" value="${pDisplay.g1}" id="pred-${m.id}-1" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
      <span class="score-sep"> - </span>
      <div class="team-side right">
        <span class="team-flag">${mDisplay.t2}</span>
        <span class="team-name">${mDisplay.n2}</span>
        <input class="score-input" type="number" min="0" max="20" value="${pDisplay.g2}" id="pred-${m.id}-2" ${locked?'disabled':''} oninput="savePred('${m.id}')">
      </div>
    </div>
    <div class="match-meta"><span>📅 ${fmtDate(sd?.date||m.date)} ${sd?.time||m.time}${m._phaseLabel?` · <span style="color:var(--text2);font-size:10px">${m._phaseLabel}</span>`:''}</span><span>${lockStr} ${predSmall}</span></div>
    ${r16DeciderBlock}${resultRow}${adminRow}${adminR16Row}${adminLockControls}${adminScheduleRow}${adminKnockoutRow}
  </div>`;
}

function toggleRivals(mid){ const el=document.getElementById('rv-'+mid); if(!el) return; el.classList.toggle('open'); }

// Inyecta los selects de equipos KO de forma lazy (solo cuando el admin hace clic)
function toggleKOEditSelects(mid, koPhase){
  const container = document.getElementById('adm-ko-selects-'+mid);
  if(!container) return;
  const isOpen = container.style.display === 'flex';
  if(isOpen){ container.style.display = 'none'; return; }
  // Si ya tiene contenido, solo mostrar
  if(!container.dataset.built){
    container.dataset.built = '1';
    const koMatch = getKOMatches(koPhase).find(m=>m.id===mid) || {};
    container.innerHTML = `
      <span style="font-size:10px;color:var(--admin);font-weight:700;width:100%">EQUIPOS:</span>
      <select id="adm-ko-sel1-${mid}" style="flex:1;min-width:120px;padding:6px 8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);font-size:12px">
        ${KO_TEAM_OPTIONS_HTML}
      </select>
      <span style="font-size:11px;color:var(--text3);align-self:center">vs</span>
      <select id="adm-ko-sel2-${mid}" style="flex:1;min-width:120px;padding:6px 8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);font-size:12px">
        ${KO_TEAM_OPTIONS_HTML}
      </select>
      <button class="btn-admin" onclick="adminSetKnockoutTeams(${koPhase},'${mid}')" style="width:100%">Guardar cruce</button>`;
    // Preseleccionar equipos actuales
    const s1 = document.getElementById('adm-ko-sel1-'+mid);
    const s2 = document.getElementById('adm-ko-sel2-'+mid);
    if(s1 && koMatch.n1 && koMatch.n1 !== 'Por definir') s1.value = koMatch.n1;
    if(s2 && koMatch.n2 && koMatch.n2 !== 'Por definir') s2.value = koMatch.n2;
  }
  container.style.display = 'flex';
}

async function savePred(mid){
  if(!S.currentLeague) return;
  const g1now=document.getElementById('pred-'+mid+'-1')?.value??'';
  const g2now=document.getElementById('pred-'+mid+'-2')?.value??'';
  if(!S.predictions[S.currentLeague]) S.predictions[S.currentLeague]={};
  if(!S.predictions[S.currentLeague][S.currentUser]) S.predictions[S.currentLeague][S.currentUser]={};
  const prev = S.predictions[S.currentLeague][S.currentUser][mid] || {};
  S.predictions[S.currentLeague][S.currentUser][mid] = { ...prev, g1:g1now, g2:g2now };
  // IMPORTANTE: guardamos ya mismo una copia local (localStorage), sin esperar a Firestore.
  // Antes esto no se hacía, así que si la escritura a Firestore fallaba (permisos, red,
  // recarga antes de que terminara el debounce, etc.) la predicción desaparecía por
  // completo: ni en el servidor ni en local. Con esto, al menos en tu propio dispositivo
  // siempre queda guardado lo último que escribiste, aunque el servidor falle.
  save();
  // Actualizar visibilidad del decider KO sin destruir el DOM completo
  updateKODeciderVisibility(mid);
  clearTimeout(saveTimers[mid]);
  saveTimers[mid]=setTimeout(async ()=>{
    const g1=document.getElementById('pred-'+mid+'-1')?.value||'';
    const g2=document.getElementById('pred-'+mid+'-2')?.value||'';
    const ind=document.getElementById('save-ind');
    try{
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
      const predRef = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', S.currentUser);
      // merge:true hace un merge atómico solo del campo [mid] en el servidor, sin necesidad
      // de leer antes el documento entero. Así, si guardas dos partidos casi a la vez (p.ej.
      // uno de dieciseisavos y otro de octavos), cada guardado solo toca su propio partido y
      // nunca puede pisar/revertir el resultado que se acaba de guardar para otro partido.
      await setDoc(predRef, { [mid]: { g1, g2 } }, { merge: true });
      if(ind){ind.textContent='✅ Guardado';setTimeout(()=>{if(ind)ind.textContent='';},1800);}
    }catch(e){
      console.error('savePred error', e);
      // ANTES: el error solo se veía en la consola del navegador, así que el usuario creía
      // que se había guardado cuando en realidad nunca llegó al servidor (y por tanto sus
      // amigos en la liga nunca lo veían). Ahora se avisa explícitamente.
      if(ind){ ind.textContent='❌ No se pudo guardar en el servidor'; ind.style.color='#e63946'; setTimeout(()=>{ if(ind){ ind.textContent=''; ind.style.color=''; } },4000); }
      alert('No se pudo guardar tu predicción en el servidor (se ha guardado solo en este dispositivo). Motivo: '+(e?.message||String(e))+'\n\nRevisa tu conexión y vuelve a intentarlo; si el problema persiste, puede ser un permiso de Firestore.');
    }
  },700);
}

// Muestra u oculta el bloque del decider KO en tiempo real según si el usuario predice empate,
// sin reconstruir todo el DOM (evita perder el foco del input).
function updateKODeciderVisibility(mid){
  const card = document.getElementById('mc-'+mid);
  if(!card) return;
  const existing = card.querySelector('.r16-decider');
  const inp1 = document.getElementById('pred-'+mid+'-1');
  const inp2 = document.getElementById('pred-'+mid+'-2');
  if(!inp1||!inp2) return;
  const v1 = inp1.value, v2 = inp2.value;
  const userDraw = v1!==''&&v2!==''&&!isNaN(parseInt(v1))&&!isNaN(parseInt(v2))&&parseInt(v1)===parseInt(v2);
  // Obtener nombres de equipos del partido desde la tarjeta
  const teamNames = card.querySelectorAll('.team-name');
  const n1 = teamNames[0]?.textContent||'Local';
  const n2 = teamNames[1]?.textContent||'Visitante';
  const p = (S.predictions[S.currentLeague]?.[S.currentUser]?.[mid]) || {};
  const userWinner = p.r16_winner||'';
  const userDecidedBy = p.r16_decidedBy||'';
  const r16LocalActive = userWinner==='1'?'active':'';
  const r16AwayActive = userWinner==='2'?'active':'';
  const r16ETActive = userDecidedBy==='ET'?'active':'';
  const r16PENActive = userDecidedBy==='PEN'?'active':'';
  // Obtener resultado real si existe para mostrar texto
  const res = S.results?.[mid];
  const realDraw90 = res && Number(res.g1)===Number(res.g2);
  const decidedBy = res?.decidedBy||null;
  const r16RealText = decidedBy?(decidedBy==='ET'?' (Prórroga)':' (Penaltis)'):'';
  const showDecider = userDraw || realDraw90;
  if(showDecider){
    const label = res ? '¿Quién pasó?' : '¿Quién pasa en caso de empate?';
    const html = `<div class="r16-decider" id="r16d-${mid}">
      <div class="r16-decider-label">${label}</div>
      <div class="r16-decider-row">
        <button class="r16-btn ${r16LocalActive}" onclick="saveR16Pred('${mid}','winner','1')">${n1}</button>
        <button class="r16-btn ${r16AwayActive}" onclick="saveR16Pred('${mid}','winner','2')">${n2}</button>
      </div>
      <div class="r16-decider-label" style="margin-top:8px">¿Cómo?${r16RealText}</div>
      <div class="r16-decider-row">
        <button class="r16-btn ${r16ETActive}" onclick="saveR16Pred('${mid}','decidedBy','ET')">Prórroga</button>
        <button class="r16-btn ${r16PENActive}" onclick="saveR16Pred('${mid}','decidedBy','PEN')">Penaltis</button>
      </div>
    </div>`;
    if(existing){
      existing.outerHTML = html;
    } else {
      // Insertar antes de resultRow (o al final de match-meta)
      const meta = card.querySelector('.match-meta');
      if(meta) meta.insertAdjacentHTML('afterend', html);
    }
  } else {
    if(existing) existing.remove();
  }
}

async function saveR16Pred(mid, field, value){
  if(!S.currentLeague) return;
  // Defensa adicional: si el partido está cerrado (lock forzado a '1' o ya tiene resultado
  // real con decidedBy/r16_winner fijado por el admin), no permitir que el usuario lo cambie.
  // (El control principal es no renderizar el botón como clicable; esto es un respaldo.)
  const lockOverrideVal = S.lockOverrides?.[mid] ?? localStorage.getItem(`wf26_forced_lock_${mid}`);
  const isForcedClosed = (lockOverrideVal === '1');
  const realRes = S.results[mid];
  const realAlreadyDecided = realRes && realRes.r16_winner && realRes.decidedBy;
  if(isForcedClosed || realAlreadyDecided) return;
  const fieldKey = field === 'winner' ? 'r16_winner' : 'r16_decidedBy';
  // Igual que en savePred: actualizamos el estado local y lo persistimos en localStorage
  // ANTES de intentar escribir en Firestore, para no perder el dato si la escritura falla.
  if(!S.predictions[S.currentLeague]) S.predictions[S.currentLeague] = {};
  if(!S.predictions[S.currentLeague][S.currentUser]) S.predictions[S.currentLeague][S.currentUser] = {};
  const prevLocal = S.predictions[S.currentLeague][S.currentUser][mid] || {};
  S.predictions[S.currentLeague][S.currentUser][mid] = { ...prevLocal, [fieldKey]: value };
  save();
  renderPhaseBody();
  const ind = document.getElementById('save-ind');
  try{
    const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const predRef = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', S.currentUser);
    // merge:true: solo se toca el campo [mid][fieldKey] en el servidor, sin leer/reescribir
    // el documento completo, así no puede pisar la predicción de otro partido guardada a la vez.
    await setDoc(predRef, { [mid]: { [fieldKey]: value } }, { merge: true });
    if(ind){ ind.textContent='✅ Guardado'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 1800); }
  }catch(e){
    console.error('saveR16Pred error', e);
    // ANTES este error se tragaba en silencio: el usuario veía su elección marcada en
    // pantalla (estado local) pero nunca llegaba al servidor, así que ni persistía al
    // recargar en otro dispositivo ni la veían sus amigos de liga.
    if(ind){ ind.textContent='❌ No se pudo guardar en el servidor'; ind.style.color='#e63946'; setTimeout(()=>{ if(ind){ ind.textContent=''; ind.style.color=''; } },4000); }
    alert('No se pudo guardar tu elección en el servidor (se ha guardado solo en este dispositivo). Motivo: '+(e?.message||String(e)));
  }
}

async function adminSetResult(mid){
  const g1=document.getElementById('adm-'+mid+'-1')?.value;
  const g2=document.getElementById('adm-'+mid+'-2')?.value;
  if(g1===''||g2==='') return;
  if(!S.currentLeague) return;
  try{
    const { doc, setDoc, getDoc, collection, getDocs, runTransaction } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const newG1=parseInt(g1), newG2=parseInt(g2);
    const isDraw = newG1===newG2;
    // Preservar quién pasó / cómo si ya estaba fijado y el resultado sigue siendo empate;
    // si el nuevo resultado ya no es empate, se limpian (ya no aplican)
    const prevRes = S.results[mid] || {};
    const rg = isDraw
      ? { g1:newG1, g2:newG2, ...(prevRes.r16_winner?{r16_winner:prevRes.r16_winner}:{}) , ...(prevRes.decidedBy?{decidedBy:prevRes.decidedBy}:{}) }
      : { g1:newG1, g2:newG2 };

    // 1) Guardar resultado en tournament/results (global para todas las ligas).
    // merge:true + solo el campo [mid]: así guardar un partido nunca puede pisar
    // el resultado de otro partido, aunque se guarden casi a la vez.
    const tournRef = doc(fbDb(), 'tournament', 'results');
    await setDoc(tournRef, { [mid]: rg }, { merge: true });

    // 2) Recalcular puntos para TODAS las predicciones de la liga.
    // IMPORTANTE: se usa una transacción por documento de usuario, para que la
    // lectura+escritura sea atómica. Esto es lo que garantiza que cada partido
    // sea independiente: si dos partidos se guardan casi a la vez, cada
    // transacción lee el estado más reciente justo antes de escribir, en vez de
    // basarse en una foto tomada al principio de la función (que era lo que
    // causaba que guardar un partido "revirtiera" el resultado recién guardado
    // de otro).
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id;
      const ref = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid);
      await runTransaction(fbDb(), async (tx)=>{
        const snap = await tx.get(ref);
        const data = snap.exists() ? (snap.data()||{}) : {};
        const p=data[mid]||{g1:'',g2:''};
        const pts=calcPoints(rg,p,mid);
        const totalPts = Object.entries(data).reduce((acc,[k,v])=> (k===mid||k==='_totalPts') ? acc : acc+(v?.points||0), 0) + pts;
        tx.set(ref, { [mid]: { ...p, points: pts }, _totalPts: totalPts }, { merge: true });
      });
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
  }catch(e){ console.error('adminSetResult error', e); alert('Error al guardar el resultado: '+(e?.message||String(e))); }
}

// El admin fija el resultado REAL de quién pasó / cómo (prórroga o penaltis) cuando
// el resultado a 90' fue empate. Esto es distinto de saveR16Pred, que guarda la
// PREDICCIÓN del usuario; aquí se guarda en tournament/results (el resultado oficial)
// y se recalculan los puntos de todas las predicciones de la liga.
async function adminSetR16Result(mid, field, value){
  if(!S.currentLeague) return;
  const prevRes = S.results[mid];
  if(!prevRes) return;
  try{
    const { doc, setDoc, getDoc, collection, getDocs, runTransaction } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const fieldKey = field === 'winner' ? 'r16_winner' : 'decidedBy';
    const rg = { ...prevRes, [fieldKey]: value };

    // 1) Guardar en tournament/results (global para todas las ligas).
    // merge:true + solo [mid]: aislar este partido de cualquier otro guardado en paralelo.
    const tournRef = doc(fbDb(), 'tournament', 'results');
    await setDoc(tournRef, { [mid]: rg }, { merge: true });

    // 2) Recalcular puntos para TODAS las predicciones de la liga, con una
    // transacción por usuario para que la lectura+escritura sea atómica y no
    // pueda pisar el resultado de otro partido guardado a la vez.
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id;
      const ref = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid);
      await runTransaction(fbDb(), async (tx)=>{
        const snap = await tx.get(ref);
        const data = snap.exists() ? (snap.data()||{}) : {};
        const p=data[mid]||{g1:'',g2:''};
        const pts=calcPoints(rg,p,mid);
        const totalPts = Object.entries(data).reduce((acc,[k,v])=> (k===mid||k==='_totalPts') ? acc : acc+(v?.points||0), 0) + pts;
        tx.set(ref, { [mid]: { ...p, points: pts }, _totalPts: totalPts }, { merge: true });
      });
    }));

    // 3) Actualizar cache local y redibujar
    S.results[mid]=rg;
    S.adminResults = S.adminResults || {};
    S.adminResults[mid] = rg;
    localStorage.setItem('wf26_admin_results', JSON.stringify(S.adminResults));
    Object.keys(S.predictions[S.currentLeague]||{}).forEach(uid=>{
      if(uid !== S.currentUser) delete S.predictions[S.currentLeague][uid];
    });
    renderPhaseBody();
    renderRanking();
    const ind=document.getElementById('save-ind');
    if(ind){ind.textContent='✅ Guardado';setTimeout(()=>{if(ind)ind.textContent='';},2000);}
  }catch(e){ console.error('adminSetR16Result error', e); alert('Error: '+(e?.message||String(e))); }
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
    const { doc, setDoc, getDoc, collection, getDocs, runTransaction } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');

    // 1) Marcar como vetado en tournament/results (global).
    // merge:true + solo [mid]: no toca el resultado de ningún otro partido.
    const tournRef2 = doc(fbDb(), 'tournament', 'results');
    await setDoc(tournRef2, { [mid]: { vetoed: true } }, { merge: true });

    // 2) Limpiar el campo points de ese partido en todas las predicciones,
    // con una transacción por usuario para que sea atómico frente a otros
    // guardados/borrados concurrentes de otros partidos.
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid = dSnap.id;
      const ref = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid);
      await runTransaction(fbDb(), async (tx)=>{
        const snap = await tx.get(ref);
        const data = snap.exists() ? (snap.data()||{}) : {};
        if(!data[mid]) return;
        const { points: _removed, ...predWithoutPts } = data[mid];
        const totalPts = Object.entries(data).reduce((acc,[k,v])=> (k===mid||k==='_totalPts') ? acc : acc+(v?.points||0), 0);
        tx.set(ref, { [mid]: predWithoutPts, _totalPts: totalPts }, { merge: true });
      });
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
    const { doc, getDoc, setDoc, collection, getDocs, runTransaction } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const resSnap = await getDoc(doc(fbDb(), 'tournament', 'results'));
    const allResults = resSnap.exists() ? (resSnap.data()||{}) : {};
    const rg = allResults[mid];
    if(!rg || rg.vetoed) return;
    const predSnaps = await getDocs(collection(fbDb(), 'leagues', S.currentLeague, 'predictions'));
    await Promise.all(predSnaps.docs.map(async (dSnap)=>{
      const uid=dSnap.id;
      const ref = doc(fbDb(), 'leagues', S.currentLeague, 'predictions', uid);
      await runTransaction(fbDb(), async (tx)=>{
        const snap = await tx.get(ref);
        const data = snap.exists() ? (snap.data()||{}) : {};
        const p=data[mid]||{g1:'',g2:''};
        const pts=calcPoints(rg,p,mid);
        const totalPts = Object.entries(data).reduce((acc,[k,v])=> (k===mid||k==='_totalPts') ? acc : acc+(v?.points||0), 0) + pts;
        tx.set(ref, { [mid]: {...p, points: pts}, _totalPts: totalPts }, { merge: true });
      });
    }));
    Object.keys(S.predictions[S.currentLeague]||{}).forEach(uid=>{
      if(uid !== S.currentUser) delete S.predictions[S.currentLeague][uid];
    });
    renderPhaseBody();
    renderRanking();
    const ind=document.getElementById('save-ind');
    if(ind){ind.textContent='✅ Puntos recalculados';setTimeout(()=>{if(ind)ind.textContent='';},2000);}
  }catch(e){ console.error('adminRecalc error', e); alert('Error al recalcular: '+(e?.message||String(e))); }
}

// ===== ADMIN TOTAL: ELIMINAR / AÑADIR PARTIDOS =====

// Elimina un partido POR COMPLETO de la vista de todos los usuarios (predicciones, grupos,
// tabla por fecha...). No se toca ningún dato de predicciones ya guardado: es reversible
// desde el propio panel de "Partidos eliminados" del grupo.
async function adminDeleteMatch(mid){
  if(!isTotalAdmin()) return;
  if(!confirm('¿Eliminar este partido de todas las vistas? Podrás restaurarlo después desde "Partidos eliminados".')) return;
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'deleted_matches');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const next = { ...existing, [mid]: true };
    await setDoc(ref, next, { merge: false });
    S.deletedMatches = next;
    localStorage.setItem('wf26_deleted_matches', JSON.stringify(next));
    save();
    renderPhaseBody();
    if(document.getElementById('tab-grupos')?.classList.contains('active')) renderGruposTab();
    const ind = document.getElementById('save-ind');
    if(ind){ ind.textContent='🗑️ Partido eliminado'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 2000); }
  }catch(e){ console.error('adminDeleteMatch error', e); alert('Error: '+(e?.message||String(e))); }
}

// Restaura un partido previamente eliminado.
async function adminRestoreMatch(mid){
  if(!isTotalAdmin()) return;
  try{
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'deleted_matches');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const next = { ...existing };
    delete next[mid];
    await setDoc(ref, next, { merge: false });
    S.deletedMatches = next;
    localStorage.setItem('wf26_deleted_matches', JSON.stringify(next));
    save();
    renderPhaseBody();
    if(document.getElementById('tab-grupos')?.classList.contains('active')) renderGruposTab();
  }catch(e){ console.error('adminRestoreMatch error', e); alert('Error: '+(e?.message||String(e))); }
}

// Lista, para un grupo dado, los partidos eliminados (id + etiqueta) para poder restaurarlos.
// Busca tanto en el calendario oficial como en los partidos añadidos manualmente.
function getDeletedMatchesInfo(group){
  const all = [ ...(MATCHES_GROUP[group]||[]), ...((S.customMatches&&S.customMatches[group])||[]) ];
  return all.filter(m => S.deletedMatches && S.deletedMatches[m.id]);
}

// Guarda un partido nuevo añadido manualmente por el Admin Total dentro de un grupo.
async function adminSaveNewMatch(){
  if(!isTotalAdmin()) return;
  const group = document.getElementById('adm-new-group')?.value;
  const n1 = document.getElementById('adm-new-team1')?.value?.trim();
  const n2 = document.getElementById('adm-new-team2')?.value?.trim();
  const dateVal = document.getElementById('adm-new-date')?.value;
  const timeVal = document.getElementById('adm-new-time')?.value;
  const err = document.getElementById('add-match-err');
  if(!group || !n1 || !n2 || !dateVal || !timeVal){ if(err) err.textContent='Completa todos los campos'; return; }
  if(n1 === n2){ if(err) err.textContent='Los dos equipos deben ser distintos'; return; }
  try{
    const team1 = ALL_TEAMS.find(t => t.n === n1);
    const team2 = ALL_TEAMS.find(t => t.n === n2);
    const newId = `${group}_X${Date.now()}`; // prefijo _X para no colisionar nunca con ids oficiales (g+n) o KO (KO1_/KO2_/KO3_/KO4_/KO5_/KO6_)
    const newMatch = { id:newId, t1: team1?.f||'🏳️', n1, t2: team2?.f||'🏳️', n2, date:dateVal, time:timeVal, locked:false };
    const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
    const ref = doc(fbDb(), 'tournament', 'custom_matches');
    const snap = await getDoc(ref);
    const existing = snap.exists() ? (snap.data()||{}) : {};
    const groupList = existing[group] || [];
    const next = { ...existing, [group]: [...groupList, newMatch] };
    await setDoc(ref, next, { merge: false });
    S.customMatches = next;
    localStorage.setItem('wf26_custom_matches', JSON.stringify(next));
    save();
    closeModal();
    S.currentPhase = 0;
    S.currentGroup = group;
    renderPredTab();
    if(document.getElementById('tab-grupos')?.classList.contains('active')) renderGruposTab();
  }catch(e){
    console.error('adminSaveNewMatch error', e);
    if(err) err.textContent = 'Error al guardar: '+(e?.message||String(e));
  }
}

function calcPoints(res, pred, mid){
  if(!res) return 0;
  const rg1=parseInt(res.g1), rg2=parseInt(res.g2);
  const pg1=pred.g1!==''&&pred.g1!==undefined&&pred.g1!==null?parseInt(pred.g1):null;
  const pg2=pred.g2!==''&&pred.g2!==undefined&&pred.g2!==null?parseInt(pred.g2):null;

  // ===== Partidos KO: lógica especial cuando el resultado real es empate a 90' =====
  const isKO = mid && /^KO[1-6]_/.test(String(mid));
  const decidedBy = res.decidedBy || null; // 'ET' | 'PEN'
  const realDraw90 = rg1===rg2;

  if(isKO && realDraw90){
    // Resultado real empatado a 90' → se decide por prórroga o penaltis.
    // Regla de puntos (según tu descripción):
    // 1  => No acierta ganador, pero acierta los goles de un equipo
    // 2  => Acierte ganador, pero no acierta goles de ningún equipo
    // 3  => Acierte empatan (solo 90') pero no acierta goles de ningún equipo y acierta quien pasa (no fase)
    // 4  => Acierte ganador y los goles de un equipo solo
    // 6  => Acierte quien pasa (y en qué fase) pero no acierta goles de ningún equipo (y se acierta el empate en 90')
    // 7  => Acierte el resultado exacto si no es empate
    // 8  => (KO empate) Acierte resultado exacto + acierta quien gana pero no en qué fase
    // 10 => (KO empate) Acierte resultado exacto + acierta quien gana y en qué fase

    if(pg1===null||pg2===null) return 0;

    const realWinner = res.r16_winner ? String(res.r16_winner) : null; // '1'|'2'
    const userWinner = pred.r16_winner ? String(pred.r16_winner) : null;
    const userDecidedBy = pred.r16_decidedBy || null; // 'ET'|'PEN'

    const predictedDraw = (pg1===pg2);
    const predictedExactScore = (pg1===rg1 && pg2===rg2);

    const predictedWinnerCorrect = (realWinner && userWinner && String(userWinner)===String(realWinner));
    const predictedPhaseCorrect = (predictedWinnerCorrect && userDecidedBy && decidedBy && String(userDecidedBy)===String(decidedBy));

    const acertaG1 = pg1===rg1;
    const acertaG2 = pg2===rg2;
    const aciertaAlgunGol = acertaG1 || acertaG2;
    const aciertaAmbosGoles = acertaG1 && acertaG2;

    // CASO A: el usuario predice empate en 90'
    if(predictedDraw){
      // 7 pts: resultado exacto en empate (marcador exacto)
      // Pero en tu listado para KO empate has definido 8/10 para acertar ganador/fase.
      if(predictedExactScore && !predictedWinnerCorrect){
        // solo marcador exacto (sin acertar quién pasa)
        return 7;
      }
      if(predictedExactScore && predictedWinnerCorrect && predictedPhaseCorrect){
        return 10;
      }
      if(predictedExactScore && predictedWinnerCorrect && !predictedPhaseCorrect){
        return 8;
      }

      // 3/6: acierta que empatan (90'), no acierta goles de ningún equipo,
      // y acierta quién pasa (no fase / fase).
      if(!aciertaAlgunGol){
        if(predictedWinnerCorrect && predictedPhaseCorrect) return 6;
        if(predictedWinnerCorrect && !predictedPhaseCorrect) return 3;
      }

      // resto cuando predice empate pero falla en goles/ganador
      return 0;
    }

    // CASO B: el usuario NO predice empate en 90'
    // Aquí aplicamos tu tabla de 1/2/4 para el 'ganador' (quién pasa en el KO final)
    // y los goles de un equipo (marcador en 90').
    // El 'ganador' se evalúa con el winner final (res.r16_winner), no con pg1/pg2.

    // 2: acierta ganador pero no acierta goles de ningún equipo
    if(predictedWinnerCorrect && !aciertaAlgunGol) return 2;

    // 4: acierta ganador y los goles de un equipo solo
    if(predictedWinnerCorrect && aciertaAlgunGol && !aciertaAmbosGoles) return 4;

    // 1: no acierta ganador pero acierta los goles de un equipo
    if(!predictedWinnerCorrect && aciertaAlgunGol && !aciertaAmbosGoles) return 1;

    // Si acierta ambos goles (exacto de marcador) pero no predice empate,
    // no corresponde a tu listado de KO empate; devolvemos 0.
    return 0;
  }

  if(isKO && !realDraw90){
    // Resultado real NO fue empate en 90' → puntuación estándar SIEMPRE.
    // La lógica de "quién pasa"/prórroga (3/6 pts) solo aplica cuando el
    // resultado real SÍ fue empate a 90' (bloque isKO && realDraw90 arriba).
    // Si el usuario predijo empate pero el resultado real no lo fue, simplemente
    // no acierta el ganador (predWin=0 nunca coincide con realWinner 1 o 2),
    // y se puntúa igual que cualquier otra predicción según goles/ganador.
    if(pg1===null||pg2===null) return 0;
    const realWinner = rg1>rg2?1:2; // siempre hay ganador en 90' aquí

    if(pg1===rg1&&pg2===rg2) return 7;
    const predWin=pg1>pg2?1:(pg2>pg1?2:0);
    const acertaGanador=predWin===realWinner;
    const acertaG1=pg1===rg1, acertaG2=pg2===rg2;
    const aciertaAlgunGol=acertaG1||acertaG2;
    const aciertaAmbosGoles=acertaG1&&acertaG2;
    if(aciertaAlgunGol&&!aciertaAmbosGoles&&!acertaGanador) return 1;
    if(acertaGanador&&!aciertaAlgunGol) return 2;
    if(acertaGanador&&aciertaAlgunGol&&!aciertaAmbosGoles) return 4;
    return 0;
  }

  // ===== Partidos de grupos: lógica original =====
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
return acc + calcPoints(res, p, mid);
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
      // IMPORTANTE: NUNCA pisar aquí las predicciones del propio usuario actual.
      // Esta función se llama cada vez que se cambia de fase o se abre la pestaña de
      // predicciones (renderPredTab -> ensureLeaguePredictionsLoaded), y su único propósito
      // es traer las predicciones de LOS DEMÁS miembros para el panel de rivales.
      // Antes, si el usuario acababa de guardar una predicción y cambiaba de fase antes de
      // que terminara de propagarse la escritura a Firestore (debounce de 700ms + latencia
      // de red), esta función volvía a leer la copia todavía antigua del servidor y
      // sobrescribía en memoria la predicción recién hecha, haciéndola "desaparecer" de la
      // pantalla aunque sí se hubiera guardado. Las predicciones propias siempre viven ya
      // en S.predictions/localStorage (savePred/saveR16Pred) y son la fuente de verdad local;
      // no hace falta ni conviene recargarlas desde aquí.
      if(d.id === S.currentUser) return;
      S.predictions[leagueCode][d.id] = d.data() || {};
    });
  }catch(e){
    console.error('ensureLeaguePredictionsLoaded error', leagueCode, e);
    // Fallback: intentar cargar uid por uid (por si las reglas son más restrictivas)
    try{
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
      if(!S.predictions[leagueCode]) S.predictions[leagueCode] = {};
      await Promise.all((memberUids||[]).map(async uid => {
        if(uid === S.currentUser) return; // ver comentario arriba: nunca pisar las propias
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
    // Siempre se recarga desde Firestore (nunca nos fiamos de la caché local): así, si un
    // miembro de la liga sube o cambia su foto de perfil desde OTRO dispositivo/red, el resto
    // la ve en cuanto vuelva a abrir la Tabla, sin depender de que su avatar estuviera vacío.
    const need=(uids||[]).filter(uid=>!!uid);
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

  filtersEl.innerHTML = '';

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
  const matches = getGroupMatches(group);
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
      <span class="standing-name">${t.name}</span>${extraLabel?`<span class="standing-group-label">${extraLabel}</span>`:''}
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
  renderGruposTab();
}

// ===== TAB GRUPOS (clasificación real de equipos) =====
function renderGruposTab(){
  const listEl = document.getElementById('grupos-list');
  if(!listEl) return;
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

  // Centrar tab activo
  requestAnimationFrame(() => {
    const tabsEl = listEl.querySelector('.group-tabs');
    const activeTab = listEl.querySelector('.group-tab.active');
    if(tabsEl && activeTab){
      const tabsCenter = tabsEl.offsetWidth / 2;
      const activeCenter = activeTab.offsetLeft + activeTab.offsetWidth / 2;
      tabsEl.scrollLeft = activeCenter - tabsCenter;
    }
  });
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
    if(ua){
      if(em) em.style.display='none';
      let img=ab.querySelector('img.pi');
      if(!img){
        img=document.createElement('img');
        img.className='pi';
        img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;z-index:1;';
        // Insertar ANTES del input[type=file] (que tiene z-index:2) para que el input
        // siga estando clicable encima de la imagen y se pueda volver a cambiar la foto.
        const fileInput = ab.querySelector('input[type=file]');
        if(fileInput) ab.insertBefore(img, fileInput);
        else ab.appendChild(img);
      }
      img.src=ua;
    }
  }
}

// Redimensiona y comprime una imagen a un dataURL JPEG pequeño, para poder
// guardarla en el documento de Firestore del usuario (límite de 1MB por documento).
function resizeImageToDataURL(file, maxSize, quality){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        let { width, height } = img;
        if(width > height){
          if(width > maxSize){ height = Math.round(height * (maxSize/width)); width = maxSize; }
        } else {
          if(height > maxSize){ width = Math.round(width * (maxSize/height)); height = maxSize; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== Editor de recorte de foto de perfil =====
// Estado del editor: imagen cargada, zoom y desplazamiento (en px, relativos al centro)
const cropState = { img:null, scale:1, minScale:1, offX:0, offY:0, dragging:false, lastX:0, lastY:0 };
const CROP_BOX = 240; // tamaño en px del marco circular visible en el editor

function updateProfilePic(input){
  if(!input.files[0]) return;
  if(!S.currentUser) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (e)=>{
    const img = new Image();
    img.onload = ()=>{ openCropModal(img); };
    img.onerror = ()=>{ alert('No se pudo cargar la imagen.'); };
    img.src = e.target.result;
  };
  reader.onerror = ()=>{ alert('No se pudo leer el archivo.'); };
  reader.readAsDataURL(file);
  // Limpiar el input para poder volver a seleccionar el mismo archivo si hace falta
  input.value = '';
}

function openCropModal(img){
  cropState.img = img;
  // Escala mínima: la imagen debe cubrir todo el marco circular (igual que object-fit:cover)
  cropState.minScale = Math.max(CROP_BOX / img.naturalWidth, CROP_BOX / img.naturalHeight);
  cropState.scale = cropState.minScale;
  cropState.offX = 0;
  cropState.offY = 0;

  document.getElementById('modal-overlay').style.display='flex';
  const mc = document.getElementById('modal-content');
  mc.innerHTML = `
    <div class="modal-title">✂️ Ajusta tu foto</div>
    <p style="font-size:11px;color:var(--text2);margin-bottom:10px">Arrastra para mover y usa el control para hacer zoom</p>
    <div class="crop-stage" id="crop-stage" style="width:${CROP_BOX}px;height:${CROP_BOX}px">
      <img id="crop-img" src="${img.src}" draggable="false">
      <div class="crop-circle-mask"></div>
    </div>
    <input type="range" id="crop-zoom" min="100" max="300" value="100" style="width:100%;margin-top:14px" oninput="onCropZoom(this.value)">
    <div class="modal-btns" style="margin-top:14px">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-confirm" onclick="confirmAvatarCrop()">Guardar foto</button>
    </div>`;

  renderCropTransform();
  setupCropDragHandlers();
}

function renderCropTransform(){
  const im = document.getElementById('crop-img');
  if(!im || !cropState.img) return;
  const w = cropState.img.naturalWidth * cropState.scale;
  const h = cropState.img.naturalHeight * cropState.scale;
  im.style.width = w + 'px';
  im.style.height = h + 'px';
  im.style.left = (CROP_BOX/2 - w/2 + cropState.offX) + 'px';
  im.style.top = (CROP_BOX/2 - h/2 + cropState.offY) + 'px';
}

function clampCropOffset(){
  const w = cropState.img.naturalWidth * cropState.scale;
  const h = cropState.img.naturalHeight * cropState.scale;
  const maxOffX = Math.max(0, (w - CROP_BOX) / 2);
  const maxOffY = Math.max(0, (h - CROP_BOX) / 2);
  cropState.offX = Math.min(maxOffX, Math.max(-maxOffX, cropState.offX));
  cropState.offY = Math.min(maxOffY, Math.max(-maxOffY, cropState.offY));
}

function onCropZoom(sliderVal){
  // El slider va de 100 a 300 (%), se traduce a un factor sobre la escala mínima
  const factor = Number(sliderVal) / 100;
  cropState.scale = cropState.minScale * factor;
  clampCropOffset();
  renderCropTransform();
}

// Referencias a los listeners de window del editor de recorte, para poder quitarlos
// y no acumularlos cada vez que se abre el modal (evita fugas y arrastres duplicados)
let cropWindowListeners = null;

function setupCropDragHandlers(){
  const stage = document.getElementById('crop-stage');
  if(!stage) return;

  // Quitar listeners de una apertura anterior del editor, si quedaron
  teardownCropDragHandlers();

  const getPoint = (e)=> e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY };

  const onDown = (e)=>{
    cropState.dragging = true;
    const p = getPoint(e);
    cropState.lastX = p.x; cropState.lastY = p.y;
  };
  const onMove = (e)=>{
    if(!cropState.dragging) return;
    e.preventDefault();
    const p = getPoint(e);
    cropState.offX += (p.x - cropState.lastX);
    cropState.offY += (p.y - cropState.lastY);
    cropState.lastX = p.x; cropState.lastY = p.y;
    clampCropOffset();
    renderCropTransform();
  };
  const onUp = ()=>{ cropState.dragging = false; };

  stage.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  stage.addEventListener('touchstart', onDown, { passive:true });
  stage.addEventListener('touchmove', onMove, { passive:false });
  stage.addEventListener('touchend', onUp);

  cropWindowListeners = { onMove, onUp };
}

function teardownCropDragHandlers(){
  if(!cropWindowListeners) return;
  window.removeEventListener('mousemove', cropWindowListeners.onMove);
  window.removeEventListener('mouseup', cropWindowListeners.onUp);
  cropWindowListeners = null;
}

async function confirmAvatarCrop(){
  if(!cropState.img || !S.currentUser) return;
  const ind = document.getElementById('save-ind');
  try{
    // Recortar exactamente lo que se ve dentro del marco circular a un canvas cuadrado.
    // Se invierte la misma transformación que aplica renderCropTransform (left = CROP_BOX/2 - w/2 + offX)
    // para hallar, en coordenadas de la imagen original, qué región cae dentro del círculo visible.
    const scale = cropState.scale;
    const w = cropState.img.naturalWidth * scale;
    const h = cropState.img.naturalHeight * scale;
    const left = CROP_BOX/2 - w/2 + cropState.offX;
    const top = CROP_BOX/2 - h/2 + cropState.offY;
    const sx = -left / scale;
    const sy = -top / scale;
    const sSize = CROP_BOX / scale;

    const canvas = document.createElement('canvas');
    const outSize = 400; // resolución del recorte; se comprime después
    canvas.width = outSize; canvas.height = outSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cropState.img, sx, sy, sSize, sSize, 0, 0, outSize, outSize);

    canvas.toBlob(async (blob)=>{
      try{
        const dataUrl = await resizeImageToDataURL(blob, 200, 0.8);

        // Comprobación de tamaño por seguridad (Firestore: límite 1MB por documento)
        if(dataUrl.length > 700000){
          alert('La imagen sigue siendo demasiado grande tras comprimirla. Prueba con otra foto.');
          return;
        }

        S.users[S.currentUser] = S.users[S.currentUser] || { username:'', firstName:'', avatar:null };
        S.users[S.currentUser].avatar = dataUrl;
        save();
        closeModal();
        renderProfileInfo();

        // Persistir en Firestore para que el resto de usuarios la vean
        const sizeKB = Math.round(dataUrl.length / 1024);
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
        await setDoc(doc(fbDb(), 'users', S.currentUser), { avatarUrl: dataUrl, updatedAt: Date.now() }, { merge: true });

        if(ind){ ind.textContent=`✅ Foto subida a la red (${sizeKB} KB)`; setTimeout(()=>{ if(ind) ind.textContent=''; }, 4000); }
        renderRanking();
      }catch(e){
        console.error('confirmAvatarCrop (inner) error', e);
        alert('Error al subir la foto: ' + (e?.message||String(e)));
      }
    }, 'image/jpeg', 0.9);
  }catch(e){
    console.error('confirmAvatarCrop error', e);
    alert('Error al recortar la foto: ' + (e?.message||String(e)));
  }
}

async function reloadAllAvatars(){
  const ind = document.getElementById('avatar-reload-ind');
  if(ind) ind.textContent = 'Recargando...';
  try{
    // Borrar caché de avatares de todos los usuarios (excepto el propio, para no perderlo)
    if(S.users){
      Object.keys(S.users).forEach(uid=>{
        if(uid !== S.currentUser) S.users[uid].avatar = null;
      });
    }
    // Obtener UIDs de los miembros de la liga actual y recargarlos desde Firestore
    const memberUids = S.currentLeague ? (S.leagues?.[S.currentLeague]?.members || []) : [];
    await ensureUsersLoaded(memberUids);
    renderRanking();
    if(ind){ ind.textContent = '✅ Fotos actualizadas'; setTimeout(()=>{ if(ind) ind.textContent=''; }, 3000); }
  }catch(e){
    if(ind){ ind.textContent = '❌ Error: ' + (e?.message||String(e)); }
  }
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

// ===== ESTILOS R16 DECIDER =====
(function injectR16Styles(){
  if(document.getElementById('r16-styles')) return;
  const s = document.createElement('style');
  s.id = 'r16-styles';
  s.textContent = `
    .r16-decider{background:var(--bg3,#1e2130);border:1px solid var(--border,#2a2d3e);border-radius:10px;padding:10px 12px;margin:6px 0;}
    .r16-decider-label{font-size:11px;color:var(--text2,#8b92a8);font-weight:600;margin-bottom:6px;text-align:center;}
    .r16-decider-row{display:flex;gap:8px;}
    .r16-btn{flex:1;padding:8px 6px;border-radius:8px;border:1.5px solid var(--border,#2a2d3e);background:var(--bg2,#161827);color:var(--text,#e2e8f0);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;}
    .r16-btn.active{background:var(--primary,#e63946);border-color:var(--primary,#e63946);color:#fff;}
  `;
  document.head.appendChild(s);
})();

// Init
// Exponer funciones de auth al scope global para que los onclick inline de index.html funcionen siempre
window.doLogin = doLogin;
window.doRegister = doRegister;
window.doLogout = doLogout;
window.switchAuthTab = switchAuthTab;

self.doLogin = doLogin;
self.doRegister = doRegister;
self.doLogout = doLogout;
self.switchAuthTab = switchAuthTab;

// Esperar a que Firebase esté inicializado antes de hacer cualquier llamada a Firestore/Auth
function onFirebaseReady(){
  if(!S.currentUser) return;
  (async ()=>{
    reloadStateForCurrentUser();
    if(!S.users) S.users = {};
    await refreshUserLeagues();
    await loadPredictionsFromFirestoreForCurrentUser();
    showMain();
  })();
}

// Si Firebase ya está listo (recarga rápida), ejecutar directamente; si no, esperar el evento
if(window.__FIREBASE__?.db){
  onFirebaseReady();
} else {
  window.addEventListener('firebase-ready', onFirebaseReady, { once: true });
}
