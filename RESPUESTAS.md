# Respuestas — TP3 Permisos móviles

Alumno/a: _(completar)_

## Parte A · ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a)** Un permiso es una autorización explícita que la persona usuaria le da a una app para acceder a un recurso protegido (cámara, ubicación, contactos) o a una acción sensible. La **app** declara y solicita lo que necesita, el **sistema operativo** protege los recursos, muestra el diálogo y recuerda la respuesta, y la **persona usuaria** decide y puede cambiar su decisión en Ajustes.

**b)** El sandbox es el aislamiento que el sistema le impone a cada app: solo ve sus propios archivos y procesos, y no puede tocar el hardware ni los datos de otras apps. Los permisos son las "puertas" controladas que se abren en esa caja. Sin ningún permiso, una app puede dibujar su interfaz, usar su almacenamiento privado, hacer cálculos y (en general) usar internet, que se concede al instalar.

**c)** Las cuatro razones:
1. **Privacidad:** proteger datos personales. Ej.: los contactos o la ubicación.
2. **Seguridad:** evitar que una app maliciosa dañe el dispositivo o espíe. Ej.: una linterna que lee los SMS.
3. **Control de la persona usuaria:** que decida qué comparte. Ej.: elegir "Solo esta vez" para la ubicación.
4. **Recursos y costos:** evitar un uso abusivo de batería, red o dinero. Ej.: enviar SMS premium o usar el GPS todo el día.

**d)** La **visita** es la app, el **portero** es el sistema operativo y el **dueño del departamento** es la persona usuaria. La visita pide entrar, el portero pregunta al dueño y deja pasar o no. "El portero se acuerda de la respuesta" significa que el sistema guarda la decisión y no vuelve a preguntar cada vez: la app la consulta, no la pide de nuevo.

### A2. Declarar y solicitar

| | Declarar (al compilar) | Solicitar (al ejecutar) |
|---|---|---|
| ¿Qué se hace? | Se informa al sistema qué permisos puede llegar a necesitar la app. | Se le pide a la persona usuaria, mediante el diálogo del sistema, que lo conceda en el momento en que se usa la función. |
| ¿Dónde / cómo en Android? | `<uses-permission>` en `AndroidManifest.xml`. | `PermissionsAndroid.request` / API `requestPermissions` (solo los de tiempo de ejecución). |
| ¿Dónde / cómo en iOS? | Texto de propósito (`NS…UsageDescription`) en `Info.plist`. | La primera vez que se usa la API protegida, iOS muestra el diálogo. |
| ¿Dónde / cómo en Expo? | `app.json` / `app.config.ts`: plugins, `android.permissions`, `ios.infoPlist`. | Funciones `request…PermissionsAsync()` o hooks `use…Permissions()` de cada módulo. |
| ¿Qué pasa si se omite? | Android: el diálogo nunca aparece y la petición se rechaza. iOS: la app se cierra al usar la API (y la build puede ser rechazada). | Android/iOS: la función protegida no funciona (devuelve error o datos vacíos) porque nunca se concedió. |

### A3. Verdadero o falso

- **a) F.** Lo dibuja el sistema operativo; la app solo puede explicar antes o después.
- **b) V.** Con Expo, el manifiesto y el `Info.plist` se generan a partir de `app.json` en `prebuild`.
- **c) F.** `Info.plist` es parte del binario nativo: cambiarlo requiere una nueva build y publicar en la tienda; OTA solo actualiza JavaScript y assets.
- **d) F.** Si el permiso no está declarado en el manifiesto, Android deniega la petición automáticamente sin mostrar el diálogo.
- **e) F.** `expo-permissions` está obsoleto y eliminado; hoy cada módulo trae sus propias funciones de permisos.
- **f) V.** Las notificaciones no usan clave de propósito: el diálogo de iOS lo arma el sistema sin texto propio.
- **g) V.** `status` es `'granted'` y el matiz está en `accessPrivileges: 'limited'`.
- **h) F.** En iOS, al reinstalar puede conservarse el estado un tiempo y en Android no siempre se limpia igual. Es más fiable resetear con `adb shell pm reset-permissions` / `xcrun simctl privacy … reset`.

### A4. Los estados de un permiso

**a)** Android: *sin decidir* → *concedido* o *denegado*; desde Android 11, tras dos rechazos pasa a *bloqueado* (no vuelve a aparecer el diálogo). Se puede volver a pedir mientras esté *denegado*. iOS: *sin decidir* → *concedido* o *denegado*, y ahí termina: el diálogo se muestra **una sola vez**. La diferencia central es que Android da una segunda oportunidad y iOS no.

**b)**

| Estado | `status` | `canAskAgain` | ¿Puede aparecer el diálogo? |
|---|---|---|---|
| Sin decidir | `'undetermined'` | `true` | Sí |
| Concedido | `'granted'` | `true` | No hace falta |
| Denegado (se puede volver a pedir) | `'denied'` | `true` | Sí (Android) |
| Bloqueado | `'denied'` | `false` | No: hay que ir a Ajustes |

## Parte B · Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
|---|---|---|
| INTERNET | De instalación (normal) | Se concede solo al instalar. |
| CAMERA | De tiempo de ejecución (peligroso) | Diálogo en ejecución. |
| VIBRATE | De instalación | Se concede solo al instalar. |
| SYSTEM_ALERT_WINDOW | Especial | La persona lo habilita en una pantalla de Ajustes ("Mostrar sobre otras apps"). |
| POST_NOTIFICATIONS | De tiempo de ejecución (Android 13+) | Diálogo en ejecución. |
| ACCESS_NETWORK_STATE | De instalación | Se concede solo al instalar. |
| READ_CONTACTS | De tiempo de ejecución | Diálogo en ejecución. |
| SCHEDULE_EXACT_ALARM | Especial | Pantalla de Ajustes ("Alarmas y recordatorios"). |
| RECORD_AUDIO | De tiempo de ejecución | Diálogo en ejecución. |
| MANAGE_EXTERNAL_STORAGE | Especial | Pantalla de Ajustes ("Acceso a todos los archivos"); Google Play lo restringe. |

### B2. Grupos y nombres

**a)** Un grupo reúne permisos relacionados (por ejemplo, ubicación: fina y aproximada). Si se piden `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, la persona ve **un solo diálogo** (con la opción de ubicación precisa o aproximada).

**b)** El prefijo es `android.permission.`. El de cámara: `android.permission.CAMERA`.

**c)** Los permisos de firma solo se conceden a apps firmadas con el mismo certificado que la app o el sistema que los define. No se usan en apps comunes porque solo sirven para apps del mismo fabricante o del propio sistema.

### B3. Leé el manifiesto

**a)** Se conceden solos: `INTERNET`. Hay que pedir en ejecución: `CAMERA`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS` y `READ_EXTERNAL_STORAGE` (esta última solo en Android 12 o anterior).

**b)** Que el permiso solo aplica hasta la API 32 (Android 12L); desde Android 13 no se declara. La reemplazan `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y `READ_MEDIA_AUDIO`.

**c)** `tools:node="remove"` le indica al *merge* del manifiesto que elimine ese permiso aunque lo declare una librería. En `app.json`:

```json
{ "expo": { "android": { "blockedPermissions": ["android.permission.RECORD_AUDIO"] } } }
```

**d)** En `expo.android.permissions`:

```json
{ "expo": { "android": { "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"] } } }
```

**e)** El archivo es generado: `prebuild` lo reescribe y los cambios manuales se pierden. La fuente de verdad es `app.json`. `blockedPermissions` **no** funciona en Expo Go, porque usa su propio manifiesto; hace falta una development build.

### B4. Así pregunta Android

**a)** No, el texto del diálogo lo fija el sistema. La explicación tiene que ir **antes**, en una pantalla propia de la app (pantalla previa).

**b)** "Mientras la app está en uso" concede el permiso mientras la app esté visible o en primer plano; "Solo esta vez" lo concede solo hasta que la app se cierra o pasa a segundo plano un tiempo, y luego vuelve a quedar sin decidir. Existe para los permisos de ubicación, cámara y micrófono.

**c)** Android 11+ interpreta dos rechazos como "no volver a preguntar": el diálogo deja de aparecer y `canAskAgain` pasa a `false`.

**d)** Anda bien con la aproximada: mostrar el clima o buscar "puntos de reciclaje de tu barrio". No anda con la aproximada: navegación paso a paso o registrar un recorrido.

**e)** Android **termina el proceso** de la app. Al volver, la app se reinicia y consulta el estado de nuevo.

### B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
|---|---|---|
| Nacen los permisos en tiempo de ejecución | Android 6 (API 23) | Hay que pedir los permisos peligrosos al ejecutar y contemplar que no se concedan. |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29); se pide por separado desde Android 11 (API 30) | Pedir primero primer plano y luego segundo plano, en pasos separados. |
| Dos rechazos equivalen a "no volver a preguntar" | Android 11 (API 30) | Leer `canAskAgain` y ofrecer "Abrir Ajustes" cuando es `false`. |
| Ubicación precisa o aproximada | Android 12 (API 31) | Manejar que se conceda solo la aproximada y no exigir coordenadas exactas. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Crear el canal y pedir el permiso antes de mostrar notificaciones. |
| Acceso parcial a fotos y videos ("Seleccionar fotos") | Android 14 (API 34) | Contemplar acceso limitado; mejor usar el selector del sistema, que no pide permiso. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 (API 37) | Declararlo y pedirlo si la app se comunica con dispositivos de la red local. |

**targetSdkVersion:** indica la versión de Android para la que se compiló y probó la app; el sistema aplica los comportamientos (y permisos) de esa versión. Expo SDK 57 apunta a la API 36 (Android 16), y desde el 31 de agosto de 2026 Google Play exige ese nivel de API (o superior) para publicar y actualizar apps.

## Parte C · iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist

| Recurso | Clave en Info.plist |
|---|---|
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | No lleva clave. |

### C2. Sin texto, no hay permiso

**a)** Si falta el texto y la app intenta usar la cámara, iOS **cierra la app** (crash). Al subir la build a App Store Connect, Apple la rechaza con el error **ITMS-90683** (*Missing Purpose String in Info.plist*).

**b)** **Una sola vez.** Si la persona dice que no, a la app solo le queda ofrecer una alternativa y, si quiere que cambie de idea, llevarla a Ajustes.

**c)** El sistema arma el título ("«App» quiere acceder a la cámara") y los botones; vos escribís la **línea de explicación** (el texto de propósito). En Expo se configura en el plugin de cada módulo (por ejemplo `cameraPermission`) o en `ios.infoPlist` de `app.json`.

**d)** Apple analiza el binario completo, incluidas las librerías: si una contiene la API protegida, exige el texto aunque tu código nunca la llame. Se resuelve agregando el texto de propósito de todos modos (o quitando la librería/el permiso que la dispara).

### C3. Probador de textos de propósito

| Texto propuesto | ¿Aprobado? | Versión mejorada |
|---|---|---|
| "Necesitamos tu ubicación." | No: no dice para qué. | "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." |
| "Para mejorar tu experiencia." | No: es vago y genérico. | "Usamos tu ubicación para ordenar los resultados por cercanía." |
| "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." | Sí: nombra el dato y el beneficio concreto. | — |
| "La app no funciona sin ubicación." | No: es una exigencia, no explica el beneficio. | "Usamos tu ubicación para marcar dónde está el problema que reportás." |
| "Ubicación requerida por el sistema." | No: es falso (no lo exige el sistema) y no da un beneficio. | "Usamos tu ubicación para encontrar los puntos de reciclaje de tu barrio." |

### C4. Acceso parcial y gradual

| Caso | iOS | En Expo |
|---|---|---|
| Fotos limitadas ("Seleccionar fotos") | iOS 14 | `accessPrivileges: 'limited'` en la respuesta de `expo-media-library` / `expo-image-picker`. |
| Ubicación aproximada (interruptor "Precisa") | iOS 14 | `ios.accuracy` en la respuesta de `Location.getForegroundPermissionsAsync()` (`accuracy: 'reduced'`). |
| "Permitir una vez" (ubicación) | iOS 14 | `status: 'granted'`; el permiso dura una sesión y vuelve a `undetermined` al reabrir la app. |
| Ubicación escalonada: de "al usar la app" a "Siempre" | iOS 13.4 | `Location.requestBackgroundPermissionsAsync()` después de `requestForegroundPermissionsAsync()`. |
| Notificaciones provisionales | iOS 12 | `requestPermissionsAsync({ ios: { allowProvisional: true } })` y `ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL`. |
| Rastreo entre apps (ATT) | iOS 14.5 | `expo-tracking-transparency`: `requestTrackingPermissionsAsync()`. |

Expo SDK 57 requiere **iOS 16.4** como mínimo. En la práctica, todos los casos de la tabla (iOS 12 a 14.5) están disponibles siempre, sin necesidad de comprobar la versión.

### C5. Android vs iOS, lado a lado

| | Android | iOS |
|---|---|---|
| ¿Dónde se declara? | `AndroidManifest.xml` (`uses-permission`). | `Info.plist` (textos de propósito). |
| Texto en el diálogo | No se puede poner texto propio. | Sí: el texto de propósito. |
| Oportunidades para preguntar | Hasta dos (desde Android 11, tras dos rechazos queda bloqueado). | Una sola. |
| "Solo esta vez" / "Permitir una vez" | "Solo esta vez" (ubicación, cámara, micrófono). | "Permitir una vez" (ubicación, desde iOS 14). |
| Notificaciones | Permiso de ejecución desde Android 13; requiere canal. | Diálogo propio de iOS, sin texto de propósito; admite provisionales. |
| Ubicación en segundo plano | Permiso aparte (`ACCESS_BACKGROUND_LOCATION`), pedido después del de primer plano. | "Siempre", escalonado desde "al usar la app". |
| Si falta la declaración | El diálogo no aparece y el permiso se deniega. | La app se cierra y la build puede ser rechazada. |
