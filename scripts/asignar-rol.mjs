// Crea o actualiza usuarios/{uid} con el rol indicado. Lo usa el workflow "Asignar rol a un usuario".
const { initializeApp } = await import('../functions/node_modules/firebase-admin/lib/app/index.js');
const { getAuth } = await import('../functions/node_modules/firebase-admin/lib/auth/index.js');
const { getFirestore, FieldValue } = await import('../functions/node_modules/firebase-admin/lib/firestore/index.js');

const { UID, USUARIO, NOMBRE, ROL } = process.env;
const ROLES = ['tecnico', 'administrador', 'gerente', 'desarrollador'];
const uid = String(UID || '').trim();
const usuario = String(USUARIO || '').trim().toLowerCase();
if (!uid || !/^[a-z0-9._-]{3,30}$/.test(usuario) || !NOMBRE?.trim() || !ROLES.includes(ROL)) {
  console.error('Datos inválidos: revisa uid, usuario (3-30 letras/números/._-), nombre y rol.');
  process.exit(1);
}
initializeApp({ projectId: 'ebptech-app' });
const cuenta = await getAuth().getUser(uid).catch(() => null);
if (!cuenta) { console.error(`No existe un usuario con UID ${uid} en Authentication.`); process.exit(1); }
const esperado = `${usuario}@usuarios.ebptech.app`;
if (cuenta.email !== esperado) console.warn(`Aviso: el correo de la cuenta es ${cuenta.email}; para entrar con "${usuario}" debería ser ${esperado}.`);
await getFirestore().doc(`usuarios/${uid}`).set({
  nombre: NOMBRE.trim(), usuario, rol: ROL, areas: [], activo: true, actualizado: FieldValue.serverTimestamp()
}, { merge: true });
console.log(`✓ ${usuario} ahora es ${ROL}.`);
process.exit(0);
