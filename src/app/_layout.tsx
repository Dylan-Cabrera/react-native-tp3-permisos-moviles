import { Stack } from 'expo-router';

import { ReportesProvider } from '@/lib/reportes';
import '@/lib/notificaciones';

export default function RootLayout() {
  return (
    <ReportesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
        <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear QR' }} />
        <Stack.Screen name="reporte/foto" options={{ title: 'Foto' }} />
        <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación' }} />
        <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle' }} />
        <Stack.Screen name="ajustes-app" options={{ title: 'Ajustes de la app' }} />
        <Stack.Screen name="permisos/[recurso]" options={{ presentation: 'modal', title: 'Permiso' }} />
      </Stack>
    </ReportesProvider>
  );
}
