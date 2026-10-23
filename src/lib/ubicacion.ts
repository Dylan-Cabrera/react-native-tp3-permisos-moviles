import * as Location from 'expo-location';

export type Coordenadas = { latitud: number; longitud: number; aproximada: boolean };

// Devuelve null si se deniega el permiso o falla la lectura.
export async function obtenerUbicacion(): Promise<Coordenadas | null> {
  try {
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const { coords } = await Location.getCurrentPositionAsync();
    const aproximada = permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';
    return { latitud: coords.latitude, longitud: coords.longitude, aproximada };
  } catch {
    return null;
  }
}
