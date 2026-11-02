# Publicar la app en Firebase

Cada cambio que entra a la rama `main` se publica solo en Firebase con GitHub Actions (`.github/workflows/publicar.yml`). Esta configuración se hace una sola vez.

## 1. Confirmar el ID del proyecto

En la [consola de Firebase](https://console.firebase.google.com) abre el proyecto › ⚙️ **Configuración del proyecto** › pestaña **General**. Copia el **ID del proyecto** (va en minúsculas, por ejemplo `ebptech-app` o `ebptech-app-1a2b3`).

## 2. Activar los servicios

En la consola de Firebase, dentro del proyecto:

1. **Plan Blaze:** abajo a la izquierda, "Actualizar". Las funciones del servidor lo necesitan.
2. **Authentication** › Comenzar › **Correo electrónico/contraseña** › Habilitar.
3. **Firestore Database** › Crear base de datos › ubicación **southamerica-east1 (São Paulo)** › modo producción.
4. **Hosting** › Comenzar (solo pulsa siguiente hasta el final; no hace falta instalar nada).

## 3. Registrar la app web

⚙️ Configuración del proyecto › General › **Tus apps** › icono `</>` (Web) › nombre "Ebptech App" › Registrar. Aparece un bloque `firebaseConfig` con `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`. Estos datos no son secretos.

En GitHub: repositorio › **Settings** › **Secrets and variables** › **Actions** › pestaña **Variables** › **New repository variable**, y crea estas seis:

| Variable | Valor de firebaseConfig |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |

## 4. Crear la clave de publicación (secreta)

1. Abre https://console.cloud.google.com/iam-admin/serviceaccounts y elige el proyecto.
2. **Crear cuenta de servicio** › nombre `github-publicar` › Crear y continuar.
3. Dale los roles **Editor** y **Usuario de cuenta de servicio** › Listo.
4. Entra a la cuenta creada › pestaña **Claves** › Agregar clave › **Crear clave nueva** › JSON. Se descarga un archivo.
5. En GitHub: Settings › Secrets and variables › Actions › pestaña **Secrets** › **New repository secret**. Nombre `FIREBASE_SERVICE_ACCOUNT`, y como valor pega el contenido completo del archivo JSON.
6. Borra el archivo JSON de tu computadora. No lo envíes por chat ni correo.

## 5. Publicar

GitHub › pestaña **Actions** › "Publicar en Firebase" › **Run workflow**. Al terminar, la app queda en `https://<id-del-proyecto>.web.app`.

## 6. Primer usuario y Drive

1. **Primer usuario (desarrollador):** Firebase › Authentication › Agregar usuario, con correo `tuusuario@usuarios.ebptech.app` y una contraseña. Copia su **UID**. En Firestore crea la colección `usuarios`, documento con ese UID y campos `nombre` (texto), `usuario` (texto, igual a `tuusuario`), `rol` = `desarrollador`, `areas` (array vacío), `activo` = true. Con ese usuario ya puedes crear a los demás desde la app.
2. **Drive:** comparte la carpeta **1-EBPTECH 2025** como **Editor** con `<id-del-proyecto>-compute@developer.gserviceaccount.com` (la cuenta con la que corren las funciones; aparece en la lista de cuentas de servicio). Luego en Firestore crea `config/drive` con el campo `areas` (mapa) y, para cada área, el id de su carpeta (lo que va después de `/folders/` en la URL del Drive).
