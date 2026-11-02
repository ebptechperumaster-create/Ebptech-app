// Copia config/drive.json a Firestore (config/drive). Se ejecuta al publicar desde main.
import { readFileSync } from 'node:fs';
const { initializeApp } = await import('../functions/node_modules/firebase-admin/lib/app/index.js');
const { getFirestore, FieldValue } = await import('../functions/node_modules/firebase-admin/lib/firestore/index.js');

const { raiz, areas } = JSON.parse(readFileSync(new URL('../config/drive.json', import.meta.url), 'utf8'));
const malos = Object.entries(areas).filter(([, id]) => !/^[\w-]{10,}$/.test(id));
if (!raiz || malos.length) { console.error('config/drive.json inválido:', malos.map(([a]) => a).join(', ')); process.exit(1); }
initializeApp({ projectId: 'ebptech-app' });
await getFirestore().doc('config/drive').set({ raiz, areas, actualizado: FieldValue.serverTimestamp() });
console.log(`✓ Carpetas del Drive configuradas para: ${Object.keys(areas).join(', ')}`);
process.exit(0);
