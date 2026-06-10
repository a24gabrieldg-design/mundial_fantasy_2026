# TODO - Admin Total (global)

## Objetivo
Habilitar un panel de **Admin Total** dentro de la app para que, al iniciar sesión, el admin pueda:
1) Editar **horas/fechas** de todos los partidos (afecta al cierre/lock).
2) Editar **puntuaciones** (reglas) usadas por todas las ligas.
3) Elegir los **participantes** en eliminatorias (KO) (y reflejarlo en el bracket UI).

## Checklist técnico
- [ ] Identificar quién es Admin Total (definido por email `ADMIN_EMAIL` en `app.js`).
- [ ] Persistir config global en Firestore (recomendado):
  - Doc tipo `adminTotal/config` o `adminTotal/1`.
  - Campos esperados:
    - `scheduleOverrides: { [matchId]: { date, time } }`
    - `scoringRules: { exact, winnerNoGoals, winnerAndOneTeamGoals, oneTeamGoalsNoExact }`
    - `knockoutTeams: { [koMatchId]: { t1, t2, n1, n2 } }` o similar.
- [ ] Al iniciar sesión:
  - [ ] cargar config global desde Firestore si `isTotalAdmin()`.
  - [ ] reemplazar `S.schedule` y el bracket KO (S.knockoutMatches) con lo guardado.
  - [ ] hacer que `lock` use override.
  - [ ] hacer que `calcPoints` use reglas cargadas.
- [ ] UI Admin Total:
  - [ ] añadir un botón/acción visible solo para admin total.
  - [ ] reutilizar `admin-overlay` modal existente.
  - [ ] formulario para editar horarios (por partido o bulk con inputs).
  - [ ] formulario para editar reglas de puntuación.
  - [ ] formulario/selector para bracket KO (equipo1/equipo2 por cruce).
- [ ] Recalcular puntos automáticamente cuando se cambie:
  - [ ] `scoringRules`
  - [ ] `scheduleOverrides`
  - [ ] KO bracket (si cambia el set de partidos o sus teams)
- [ ] Compatibilidad:
  - [ ] si no hay config guardada, usar defaults actuales.

## Archivos a tocar
- [ ] `index.html` (panel/admin button si hace falta)
- [ ] `styles.css` (estilos del panel)
- [ ] `app.js` (carga/persistencia/wiring)
- [ ] opcional: añadir helpers en endpoint si se decide guardar ahí

