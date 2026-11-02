# Ebptech App

App web instalable (PWA) para Ebptech Perú: menús por área, registros con geolocalización, usuarios con roles y explorador del Drive de la empresa. Reemplaza a la app de AppSheet "Base para APP Ebptech tecnico".

Especificación: https://claude.ai/artifact/DPmJER1fsnePYbFmHwsSX6

## Qué incluye (paso 2)

- Login con usuario y contraseña (Firebase Authentication; el usuario se guarda como `usuario@usuarios.ebptech.app`).
- Roles técnico, administrador, gerente y desarrollador, con áreas asignadas (`src/lib/permisos.js`, `firestore.rules`).
- Menús de AppSheet por área (`src/config/menus.js`) con barra inferior y menú lateral.
- Registro de ingreso, inicio de trabajo, fin de trabajo y salida con ubicación GPS (`marcaciones`).
- Ubicación en vivo cada 30 s mientras el trabajador está en turno y la app abierta (`ubicaciones`), visible en Operaciones › Ubicación de Personal.
- Gestión de usuarios para gerencia y desarrollo (función `crearUsuario`, `restablecerContrasena`).
- Explorador del Drive por área: listar, buscar y subir archivos (funciones `driveListar`, `driveSubir`).

Los demás formularios muestran "Próximamente" y se construyen en el paso 3.

## Desarrollo local (sin proyecto de Firebase)

Requiere Node 22 y Java 17+ (para los emuladores).

```bash
npm install && (cd functions && npm install)
npm install -g firebase-tools
npm run build
npm run emulators          # en otra terminal:
npm run seed               # crea dev, gerente, admin.ope, tecnico1 (contraseña Ebptech2026)
```

Abre http://127.0.0.1:5000. Sin `.env.local`, la app se conecta sola a los emuladores. Para desarrollo con recarga en vivo usa `npm run dev` (http://localhost:5173).

## Puesta en producción

1. Crea un proyecto en https://console.firebase.google.com (plan Blaze, necesario para las funciones; tiene cuota gratuita).
2. Activa Authentication › Correo/contraseña, crea Firestore en la región `southamerica-east1`.
3. Registra una app web y copia sus datos a `.env.local` (ver `.env.example`).
4. `firebase use --add` y `firebase deploy`.
5. Comparte la carpeta raíz del Drive "1-EBPTECH 2025" como Editor con la cuenta de servicio de las funciones (`<id-proyecto>@appspot.gserviceaccount.com`) y llena `config/drive` con el id de la carpeta de cada área:
   `{ raiz: '1WwLG55jHMUSAaqvCwLaWGetc6VCP8nkJ', areas: { sst: '…', operaciones: '…', … } }`.
6. Crea el primer usuario desarrollador desde la consola (Authentication + documento `usuarios/{uid}` con `rol: 'desarrollador'`); los demás se crean desde la app.

## Instalar en Android

Abre la URL de la app en Chrome › menú ⋮ › "Agregar a pantalla de inicio". La ubicación solo se envía con la app abierta; para enviarla en segundo plano habría que empaquetarla con Capacitor.
