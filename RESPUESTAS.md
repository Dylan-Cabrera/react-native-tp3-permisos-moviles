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
