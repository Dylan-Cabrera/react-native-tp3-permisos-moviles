import * as Notifications from 'expo-notifications';

import { crearCanal } from './permisos';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function programarAviso(titulo: string, cuerpo: string, segundos: number) {
  await crearCanal();
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      channelId: 'reportes',
    },
  });
}

export async function notificacionesConcedidas() {
  const permiso = await Notifications.getPermissionsAsync();
  return permiso.granted;
}
