// Crea usuarios de prueba en los emuladores locales (no toca producción).
// Uso: con `npm run emulators` corriendo, ejecuta `npm run seed`.
process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
const { initializeApp } = await import('../functions/node_modules/firebase-admin/lib/app/index.js');
const { getAuth } = await import('../functions/node_modules/firebase-admin/lib/auth/index.js');
const { getFirestore } = await import('../functions/node_modules/firebase-admin/lib/firestore/index.js');

initializeApp({ projectId: 'demo-ebptech' });
const usuarios = [
  { usuario: 'dev', nombre: 'Desarrollador Ebptech', rol: 'desarrollador', areas: [] },
  { usuario: 'gerente', nombre: 'Gerente General', rol: 'gerente', areas: [] },
  { usuario: 'admin.ope', nombre: 'Administrador Operaciones', rol: 'administrador', areas: ['operaciones'] },
  { usuario: 'tecnico1', nombre: 'Técnico de Campo', rol: 'tecnico', areas: ['operaciones', 'sst'] }
];
for (const u of usuarios) {
  const email = `${u.usuario}@usuarios.ebptech.app`;
  let cuenta;
  try { cuenta = await getAuth().getUserByEmail(email); }
  catch { cuenta = await getAuth().createUser({ email, password: 'Ebptech2026', displayName: u.nombre }); }
  await getFirestore().doc(`usuarios/${cuenta.uid}`).set({ ...u, activo: true });
  console.log(`✓ ${u.usuario} (${u.rol})`);
}
await getFirestore().doc('config/drive').set({ raiz: '1WwLG55jHMUSAaqvCwLaWGetc6VCP8nkJ', areas: {} }, { merge: true });
console.log('Contraseña de todos: Ebptech2026');
process.exit(0);
