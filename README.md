# Mantenimiento IPF

App hecha con Expo SDK 57, TypeScript y Expo Router para reportar desperfectos del edificio y recibir un aviso cuando se resuelven. Usa cámara, ubicación y notificaciones, pidiendo cada permiso recién al tocar su función, y elige fotos con el selector del sistema (sin permiso de galería).

## Cómo ejecutarla

```bash
npm install
npx expo start          # Expo Go
npx expo run:android    # development build (los textos de propósito solo se ven acá)
```

## Árbol de `src/app`

```
src/
├── app/
│   ├── _layout.tsx            # Stack raíz + proveedor de reportes
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tabs: Reportes, Avisos, Permisos
│   │   ├── index.tsx          # /
│   │   ├── avisos.tsx         # /avisos
│   │   └── permisos.tsx       # /permisos
│   ├── permisos/
│   │   └── [recurso].tsx      # /permisos/[recurso]  (modal)
│   ├── reporte/
│   │   ├── nuevo.tsx          # /reporte/nuevo
│   │   ├── escanear.tsx       # /reporte/escanear
│   │   ├── foto.tsx           # /reporte/foto
│   │   ├── ubicacion.tsx      # /reporte/ubicacion
│   │   └── [id].tsx           # /reporte/[id]
│   └── ajustes-app.tsx        # /ajustes-app
├── components/                # ui.tsx, PrevioPermiso.tsx
├── hooks/                     # usePermiso.ts, useRevisarAlVolver.ts
└── lib/                       # permisos.ts, ubicacion.ts, notificaciones.ts, reportes.tsx
```

## Plugins de `app.json`

```jsonc
"plugins": [
  "expo-router",
  ["expo-camera", {
    "cameraPermission": "Usamos tu cámara para leer el código QR del aula y sacar la foto del desperfecto.",
    "microphonePermission": false,   // sin NSMicrophoneUsageDescription
    "recordAudioAndroid": false      // sin RECORD_AUDIO
  }],
  ["expo-location", {
    // solo primer plano: no se activa ACCESS_BACKGROUND_LOCATION
    "locationWhenInUsePermission": "Usamos tu ubicación para marcar en qué lugar del instituto está el problema que reportás."
  }],
  ["expo-image-picker", {
    "photosPermission": false,       // el selector del sistema no pide permiso de galería
    "cameraPermission": "Usamos tu cámara para sacar la foto del desperfecto que reportás.",
    "microphonePermission": false
  }],
  "expo-notifications"               // sin texto de propósito en iOS
]
```

En `expo.android` además: `permissions: ["android.permission.POST_NOTIFICATIONS"]` (la librería no lo declara) y `blockedPermissions` con los permisos que la app no usa.

## Permisos bloqueados (mínimo privilegio)

| Permiso | Por qué se bloquea |
|---|---|
| `RECORD_AUDIO` | La app no graba sonido; `expo-camera` lo agrega por defecto. |
| `SYSTEM_ALERT_WINDOW` | No se dibuja sobre otras apps; lo agrega React Native para el menú de desarrollo. |
| `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` | Las fotos se eligen con el selector del sistema y se guardan en la caché de la app. |
| `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` | No hay acceso a la galería; además Google Play restringe estos permisos. |

## Tabla de permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se deniega |
|---|---|---|---|
| Cámara (QR) | `expo-camera` | Al abrir `/reporte/escanear` y tocar "Continuar". | Escribir el código del aula a mano. |
| Cámara (foto) | `expo-image-picker` | Al tocar "Sacar foto". | "Elegir de la galería" (selector del sistema). |
| Ubicación (primer plano) | `expo-location` | Al tocar "Usar mi ubicación". | Elegir el sector a mano. Si es aproximada, se muestra "Ubicación aproximada". |
| Notificaciones | `expo-notifications` | Al activar el interruptor de `/ajustes-app`. | Los avisos llegan a la bandeja `/avisos`. |
| Galería | `expo-image-picker` (selector) | No se pide. | — |

## Auditoría del manifiesto (`npx expo prebuild`)

| Permiso | Quién lo agrega | ¿Quitado? |
|---|---|---|
| `CAMERA` | `expo-camera` / `expo-image-picker` | No (se usa) |
| `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION` | `expo-location` | No (se usan) |
| `POST_NOTIFICATIONS` | `app.json` (`android.permissions`) | No (se usa) |
| `INTERNET`, `VIBRATE` | React Native / `expo-notifications` | No (de instalación) |
| `RECORD_AUDIO` | `expo-camera` | Sí (`tools:node="remove"`) |
| `SYSTEM_ALERT_WINDOW` | React Native (solo en el manifiesto de debug) | Sí en el principal |
| `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_*` | `expo-image-picker` | Sí |

## Capturas

Pendiente: agregar en `capturas/` las imágenes pedidas (escáner en sus cuatro estados, ubicación concedida y denegada, foto desde el selector, notificación recibida, panel de permisos antes y después de volver de Ajustes, y el diálogo del sistema en una development build).
