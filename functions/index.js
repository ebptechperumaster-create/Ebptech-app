import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { google } from 'googleapis';
import { Readable } from 'node:stream';

initializeApp();
// invoker 'public': la app llama a las funciones desde el navegador; cada función valida al usuario y su rol.
setGlobalOptions({ region: 'southamerica-east1', maxInstances: 5, invoker: 'public' });

const db = getFirestore();
const DOMINIO = 'usuarios.ebptech.app';
const ROLES = ['tecnico', 'administrador', 'gerente', 'desarrollador'];
const AREAS = ['sst', 'comercial', 'logistica', 'operaciones', 'administracion', 'contabilidad', 'gerencia'];
const CARPETA = 'application/vnd.google-apps.folder';

async function perfilDe(req) {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  const s = await db.doc(`usuarios/${req.auth.uid}`).get();
  if (!s.exists) throw new HttpsError('permission-denied', 'Tu usuario no tiene perfil.');
  return { uid: s.id, ...s.data() };
}
const veTodo = (p) => p.rol === 'gerente' || p.rol === 'desarrollador';
const gestionaUsuarios = veTodo;

// ---------- Usuarios ----------
export const crearUsuario = onCall(async (req) => {
  const yo = await perfilDe(req);
  if (!gestionaUsuarios(yo)) throw new HttpsError('permission-denied', 'Solo gerencia o desarrollo pueden crear usuarios.');
  const { nombre, usuario, contrasena, rol, areas = [] } = req.data || {};
  const u = String(usuario || '').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,30}$/.test(u)) throw new HttpsError('invalid-argument', 'Usuario inválido (3 a 30 letras, números, punto o guion).');
  if (!nombre || String(nombre).trim().length < 3) throw new HttpsError('invalid-argument', 'Falta el nombre.');
  if (!contrasena || String(contrasena).length < 8) throw new HttpsError('invalid-argument', 'La contraseña debe tener al menos 8 caracteres.');
  if (!ROLES.includes(rol)) throw new HttpsError('invalid-argument', 'Rol inválido.');
  if (rol === 'desarrollador' && yo.rol !== 'desarrollador') throw new HttpsError('permission-denied', 'Solo un desarrollador puede crear otro desarrollador.');
  const areasOk = [...new Set(areas)].filter((a) => AREAS.includes(a));

  let cuenta;
  try {
    cuenta = await getAuth().createUser({ email: `${u}@${DOMINIO}`, password: String(contrasena), displayName: String(nombre).trim() });
  } catch (e) {
    if (e.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'Ese usuario ya existe.');
    throw new HttpsError('internal', 'No se pudo crear el usuario.');
  }
  await db.doc(`usuarios/${cuenta.uid}`).set({
    nombre: String(nombre).trim(), usuario: u, rol, areas: areasOk, activo: true,
    creadoPor: yo.uid, creado: FieldValue.serverTimestamp()
  });
  return { uid: cuenta.uid };
});

export const restablecerContrasena = onCall(async (req) => {
  const yo = await perfilDe(req);
  const { uid, contrasena } = req.data || {};
  if (!contrasena || String(contrasena).length < 8) throw new HttpsError('invalid-argument', 'La contraseña debe tener al menos 8 caracteres.');
  if (uid !== yo.uid && !gestionaUsuarios(yo)) throw new HttpsError('permission-denied', 'No puedes cambiar la contraseña de otro usuario.');
  await getAuth().updateUser(uid, { password: String(contrasena) });
  return { ok: true };
});

// ---------- Drive ----------
// La función usa su cuenta de servicio: la carpeta raíz "1-EBPTECH 2025" debe compartirse con ese correo como Editor.
// config/drive = { raiz: '<id>', areas: { sst: '<id>', operaciones: '<id>', ... } }
let driveCliente;
function drive() {
  if (!driveCliente) {
    const auth = new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/drive'] });
    driveCliente = google.drive({ version: 'v3', auth });
  }
  return driveCliente;
}

async function carpetaDeArea(yo, area) {
  if (!AREAS.includes(area)) throw new HttpsError('invalid-argument', 'Área inválida.');
  if (!veTodo(yo) && !(yo.areas || []).includes(area)) throw new HttpsError('permission-denied', 'No tienes acceso a esta área.');
  const cfg = (await db.doc('config/drive').get()).data() || {};
  const id = cfg.areas?.[area];
  if (!id) throw new HttpsError('failed-precondition', 'Esta área aún no tiene carpeta del Drive configurada.');
  return id;
}

// Comprueba que `carpetaId` esté dentro de `raizArea` subiendo por sus carpetas padre.
async function dentroDe(carpetaId, raizArea) {
  let actual = carpetaId;
  for (let i = 0; i < 15 && actual; i++) {
    if (actual === raizArea) return true;
    const { data } = await drive().files.get({ fileId: actual, fields: 'parents', supportsAllDrives: true });
    actual = data.parents?.[0];
  }
  return false;
}

async function carpetaPermitida(yo, area, carpetaId) {
  const raizArea = await carpetaDeArea(yo, area);
  if (!carpetaId || carpetaId === raizArea) return raizArea;
  if (!(await dentroDe(carpetaId, raizArea))) throw new HttpsError('permission-denied', 'Esa carpeta no pertenece al área.');
  return carpetaId;
}


// Convierte los errores de la API de Drive en mensajes claros para la app.
function errorDrive(e) {
  if (e instanceof HttpsError) return e;
  console.error('Error de Drive:', e?.response?.data || e);
  const razon = e?.errors?.[0]?.reason || e?.response?.data?.error?.errors?.[0]?.reason || '';
  const texto = String(e?.message || '');
  if (razon === 'accessNotConfigured' || /has not been used|is disabled|SERVICE_DISABLED/i.test(texto))
    return new HttpsError('failed-precondition', 'La API de Google Drive no está activada en el proyecto de Firebase.');
  if (razon === 'storageQuotaExceeded' || /storage quota/i.test(texto))
    return new HttpsError('resource-exhausted', 'El Drive no acepta archivos subidos por la cuenta de la app (sin cuota de almacenamiento).');
  if (e?.code === 404 || razon === 'notFound')
    return new HttpsError('not-found', 'La app no puede ver esa carpeta del Drive. Revisa que "1-EBPTECH 2025" esté compartida con la cuenta de la app.');
  if (e?.code === 403)
    return new HttpsError('permission-denied', `Drive negó el acceso: ${texto.slice(0, 200)}`);
  return new HttpsError('internal', `Error de Drive: ${texto.slice(0, 200) || 'desconocido'}`);
}
const conDrive = (fn) => async (req) => { try { return await fn(req); } catch (e) { throw errorDrive(e); } };

const escapar = (t) => String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const driveListar = onCall(conDrive(async (req) => {
  const yo = await perfilDe(req);
  const { area, carpetaId, busqueda } = req.data || {};
  const carpeta = await carpetaPermitida(yo, area, carpetaId);
  const q = busqueda?.trim()
    ? `'${carpeta}' in parents and trashed = false and name contains '${escapar(busqueda.trim())}'`
    : `'${carpeta}' in parents and trashed = false`;
  const { data } = await drive().files.list({
    q, pageSize: 200, orderBy: 'folder,name',
    fields: 'files(id,name,mimeType,modifiedTime,webViewLink,iconLink,size)',
    supportsAllDrives: true, includeItemsFromAllDrives: true
  });
  return { archivos: data.files || [] };
}));

export const driveSubir = onCall(conDrive(async (req) => {
  const yo = await perfilDe(req);
  const { area, carpetaId, nombre, mimeType, contenido } = req.data || {};
  if (!nombre || !contenido) throw new HttpsError('invalid-argument', 'Falta el archivo.');
  const carpeta = await carpetaPermitida(yo, area, carpetaId);
  const buffer = Buffer.from(contenido, 'base64');
  if (buffer.length > 8 * 1024 * 1024) throw new HttpsError('invalid-argument', 'El archivo supera 8 MB.');
  const { data } = await drive().files.create({
    requestBody: { name: String(nombre).slice(0, 200), parents: [carpeta], description: `Subido por ${yo.nombre} desde Ebptech App` },
    media: { mimeType: mimeType || 'application/octet-stream', body: Readable.from(buffer) },
    fields: 'id,name,webViewLink', supportsAllDrives: true
  });
  await db.collection('drive_subidas').add({ uid: yo.uid, nombre: yo.nombre, area, archivoId: data.id, archivo: data.name, creado: FieldValue.serverTimestamp() });
  return data;
}));
