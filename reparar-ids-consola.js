// PEGA ESTO EN LA CONSOLA DEL NAVEGADOR (F12 -> Console) ESTANDO EN LA WEB,
// CON SESIÓN INICIADA COMO ADMIN TOTAL. Luego pulsa Enter.
// Repara los ids de partidos de Octavos/Cuartos/Semis/3-4º/Final que hayan
// quedado duplicados con los de Dieciseisavos (misma causa del bug reportado).

(async () => {
  if (typeof isTotalAdmin !== 'function' || !isTotalAdmin()) {
    alert('Esto solo lo puede ejecutar el Admin Total, y con la sesión ya iniciada en la web.');
    return;
  }
  const { doc, getDoc, setDoc } = await import('https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js');
  const ref = doc(fbDb(), 'tournament', 'knockout_overrides');
  const snap = await getDoc(ref);
  const existing = snap.exists() ? (snap.data() || {}) : {};
  const changes = [];
  const next = { ...existing };

  [2, 3, 4, 5, 6].forEach(phase => {
    const arr = existing[phase];
    if (!Array.isArray(arr)) return;
    const template = KNOCKOUT_TEMPLATES[phase] || [];
    next[phase] = arr.map((m, i) => {
      const canonicalId = template[i]?.id;
      if (!canonicalId || m.id === canonicalId) return m;
      changes.push({ phase, oldId: m.id, newId: canonicalId });
      return { ...m, id: canonicalId };
    });
  });

  if (changes.length === 0) {
    alert('No se ha encontrado ningún id duplicado/incorrecto en Octavos, Cuartos, Semis, 3-4º puesto o Final.');
    return;
  }

  await setDoc(ref, next, { merge: false });
  console.log('Ids corregidos:', changes);
  alert(
    'Ids corregidos:\n\n' +
    changes.map(c => `Fase ${c.phase}: ${c.oldId} → ${c.newId}`).join('\n') +
    '\n\nRecarga la página. Si alguno de estos partidos ya tenía resultado guardado, ' +
    'vuelve a introducirlo a mano: ese resultado estaba compartido con el partido que ' +
    'tenía el mismo id, así que no se puede migrar automáticamente sin arriesgarse a adivinar mal.'
  );
})();
