/*
Apps Script: endpoint que devuelve resultados y horarios desde worldcup26.ir
para que app.js (polling) reciba:
{
  results: { [matchId]: { g1, g2 } },
  schedule: { [matchId]: { date: 'YYYY-MM-DD', time: 'HH:MM' } }
}
*/

const RESULTS_FEED_URL = 'https://worldcup26.ir/get/games';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

function normalizeNumber(v) {
  if (v === null || v === undefined) return null;
  if (v === '') return null;
  const n = Number(v);
  if (!isFinite(n)) return null;
  return n;
}

function parseJson_(text) {
  return JSON.parse(text);
}

// Convert local_date from feed format: 'MM/DD/YYYY HH:MM' -> { date:'YYYY-MM-DD', time:'HH:MM' }.
// Nota: el feed parece venir en hora local +01:00 (CET) para que los partidos coincidan con la hora España.
// Ajuste: sumamos +1 hora para que el primer partido (Mexico vs South Africa) salga a 21:00 en España.
function parseLocalDateTime_(localDate) {
  try {
    if (!localDate) return null;
    const s = String(localDate).trim();
    // Expect: MM/DD/YYYY HH:MM
    const parts = s.split(' ');
    if (parts.length < 2) return null;
    const mdY = parts[0];
    let time = parts[1].slice(0,5);

    const md = mdY.split('/');

    // Ajuste a hora España: el feed parece venir con desfase de +1h.
    // Sumamos +1 hora a la hora HH:MM manteniendo minutos.
    // Ej: 20:00 -> 21:00
    try {
      const [hh, mm] = time.split(':');
      const hNum = Number(hh);
      const mNum = Number(mm);
      if (isFinite(hNum) && isFinite(mNum)) {
        // Ajuste a hora España:
        // El feed ya viene alineado con la hora oficial en España (ej: México vs Sudáfrica sale a las 21:00).
        // El ajuste manual era necesario para que coincida con la hora oficial en España.
        // Según el feed: México vs Sudáfrica está a las 21:00 oficiales en España.
        // El ajuste manual debería ser 0.
        const h2 = hNum;
        time = `${String(h2).padStart(2,'0')}:${String(mNum).padStart(2,'0')}`;
      }
    } catch {}

    if (md.length !== 3) return null;

    const mm = md[0].padStart(2,'0');
    const dd = md[1].padStart(2,'0');
    const yyyy = md[2];

    if (!yyyy) return null;
    return { date: `${yyyy}-${mm}-${dd}`, time };
  } catch {
    return null;
  }
}

function isFinished_(finished) {
  const f = String(finished || '').toUpperCase();
  return f === 'TRUE';
}

function doGet() {
  try {
    const resp = UrlFetchApp.fetch(RESULTS_FEED_URL, { muteHttpExceptions: true });
    const code = resp.getResponseCode();
    if (code < 200 || code >= 300) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Feed fetch failed', status: code }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const payload = parseJson_(resp.getContentText());
    const games = payload && payload.games ? payload.games : [];

    const results = {};
    const schedule = {};

    const groupGames = games.filter(g => String(g.type) === 'group');

    const grouped = {};
    groupGames.forEach(g => {
      const gr = String(g.group || '');
      if (!gr || GROUPS.indexOf(gr) === -1) return;
      const md = Number(g.matchday);
      const hid = String(g.id || '');
      if (!grouped[gr]) grouped[gr] = {};
      if (!grouped[gr][md]) grouped[gr][md] = [];
      grouped[gr][md].push({
        id: hid,
        home_score: g.home_score,
        away_score: g.away_score,
        finished: g.finished,
        local_date: g.local_date
      });
    });

    GROUPS.forEach(gr => {
      for (let i = 1; i <= 6; i++) {
        const bucket = (grouped[gr] && grouped[gr][i]) ? grouped[gr][i] : [];
        if (!bucket.length) continue;
        bucket.sort((a,b)=>Number(a.id||0)-Number(b.id||0));
        const sel = bucket[0];

        const matchId = `${gr}${i}`; // A1..L6

        // schedule always (even if not finished)
        const dt = parseLocalDateTime_(sel.local_date);
        if (dt) schedule[matchId] = dt;

        if (!isFinished_(sel.finished)) continue;

        const g1 = normalizeNumber(sel.home_score);
        const g2 = normalizeNumber(sel.away_score);
        if (g1 === null || g2 === null) continue;
        results[matchId] = { g1, g2 };
      }
    });

    function addKnockout_(type, prefix, count) {
      const arr = games.filter(g => String(g.type) === type);
      arr.sort((a,b)=>Number(a.id||0)-Number(b.id||0));
      const sliced = arr.slice(0, count);

      sliced.forEach((g, idx) => {
        const matchId = `${prefix}_${idx+1}`;

        // schedule
        const dt = parseLocalDateTime_(g.local_date);
        if (dt) schedule[matchId] = dt;

        if (!isFinished_(g.finished)) return;

        const g1 = normalizeNumber(g.home_score);
        const g2 = normalizeNumber(g.away_score);
        if (g1 === null || g2 === null) return;
        results[matchId] = { g1, g2 };
      });
    }

    // Knockout mapping per your UI
    addKnockout_('r32', 'R16', 16); // R16_1..R16_16
    addKnockout_('r16', 'QF', 8);  // QF_1..QF_8
    addKnockout_('sf', 'SF', 4);  // SF_1..SF_4
    addKnockout_('final', 'FIN', 1); // FIN_1

    return ContentService
      .createTextOutput(JSON.stringify({ results, schedule }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: String(e), stack: e && e.stack }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

