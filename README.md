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

Cada cambio en `main` se publica solo con GitHub Actions. La configuración inicial (proyecto, variables, clave, primer usuario y Drive) está paso a paso en [docs/PUBLICAR.md](docs/PUBLICAR.md).

## Instalar en Android

Abre la URL de la app en Chrome › menú ⋮ › "Agregar a pantalla de inicio". La ubicación solo se envía con la app abierta; para enviarla en segundo plano habría que empaquetarla con Capacitor.
