import type { PermissionResponse } from 'expo';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type Recurso = 'camara' | 'ubicacion' | 'notificaciones';
export type Estado = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type Lectura = {
  estado: Exclude<Estado, 'cargando'>;
  parcial: boolean;
  detalle?: string;
};

export const RECURSOS: Recurso[] = ['camara', 'ubicacion', 'notificaciones'];

export const INFO: Record<Recurso, { titulo: string; beneficio: string; ajustes: string }> = {
  camara: {
    titulo: 'Cámara',
    beneficio: 'Usamos tu cámara para leer el código QR del aula y sacar la foto del desperfecto.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Cámara',
  },
  ubicacion: {
    titulo: 'Ubicación',
    beneficio: 'Usamos tu ubicación para marcar en qué lugar del instituto está el problema.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Ubicación',
  },
  notificaciones: {
    titulo: 'Notificaciones',
    beneficio: 'Usamos las notificaciones para avisarte cuando se resuelva tu reporte.',
    ajustes: 'Ajustes > Aplicaciones > Mantenimiento IPF > Notificaciones',
  },
};

type Respuesta = {
  status: string;
  granted: boolean;
  canAskAgain: boolean;
};

// Convierte la respuesta de Expo en uno de los tres estados finales.
function clasificar(r: Respuesta): Lectura['estado'] {
  if (r.granted) return 'concedido';
  return r.canAskAgain ? 'preguntable' : 'bloqueado';
}

export async function crearCanal() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('reportes', {
    name: 'Reportes',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function leerCamara(r: PermissionResponse): Lectura {
  return { estado: clasificar(r), parcial: false };
}

function leerUbicacion(r: Location.LocationPermissionResponse): Lectura {
  const aproximada = r.android?.accuracy === 'coarse' || r.ios?.accuracy === 'reduced';
  const detalle = r.android ? `accuracy: ${r.android.accuracy}` : r.ios ? `accuracy: ${r.ios.accuracy}` : undefined;
  return { estado: clasificar(r), parcial: r.granted && aproximada, detalle };
}

function leerNotificaciones(r: Notifications.NotificationPermissionsStatus): Lectura {
  const provisional = r.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return {
    estado: clasificar(r),
    parcial: false,
    detalle: provisional ? 'provisional' : undefined,
  };
}

export async function consultar(recurso: Recurso): Promise<Lectura> {
  switch (recurso) {
    case 'camara':
      return leerCamara(await Camera.getCameraPermissionsAsync());
    case 'ubicacion':
      return leerUbicacion(await Location.getForegroundPermissionsAsync());
    case 'notificaciones':
      return leerNotificaciones(await Notifications.getPermissionsAsync());
  }
}

export async function solicitar(recurso: Recurso): Promise<Lectura> {
  switch (recurso) {
    case 'camara':
      return leerCamara(await Camera.requestCameraPermissionsAsync());
    case 'ubicacion':
      return leerUbicacion(await Location.requestForegroundPermissionsAsync());
    case 'notificaciones':
      // En Android 13+ el diálogo solo aparece si el canal ya existe.
      await crearCanal();
      return leerNotificaciones(await Notifications.requestPermissionsAsync());
  }
}
