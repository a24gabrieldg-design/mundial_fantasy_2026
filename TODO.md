# TODO (WF26)

- [ ] Elegir e implementar esquema Firestore (preferir subcolecciones para evitar documentos gigantes).
- [ ] Refactorizar `app.js` para que predicciones y resultados vivan en Firestore (onSnapshot).
- [ ] Corregir carga de ligas/miembros y mostrar nombres (username/email) en ranking y rivales.
- [ ] Recalcular y persistir puntos cuando se actualicen resultados (admin).
- [ ] Crear panel Admin global (isTotalAdmin) para:
  - [ ] listar/gestionar usuarios (mínimo borrar docs de Firestore y limpiar membresías)
  - [ ] editar resultados para todas las ligas
- [ ] Añadir acciones de Admin de liga (creatorUid) para:
  - [ ] renombrar liga
  - [ ] eliminar liga
  - [ ] expulsar miembros (bloquear admin total)
- [ ] Ajustar UI/estilos en `styles.css` si se añaden nuevas secciones/botones.
- [ ] Probar flujo completo en navegador: login, crear/join liga, predicciones, admin de liga, admin global, ranking.

