import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { Boton, Pantalla, Tarjeta, Texto, Titulo } from '@/components/ui';
import { useReportes } from '@/lib/reportes';

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reportes, simularResolucion } = useReportes();
  const reporte = reportes.find((r) => r.id === id);

  if (!reporte) {
    return (
      <Pantalla>
        <Texto>No existe un reporte con ese identificador.</Texto>
      </Pantalla>
    );
  }

  const lugar = reporte.lugar;
  const textoLugar = !lugar
    ? 'Sin ubicación'
    : lugar.sector
      ? `Sector: ${lugar.sector}`
      : lugar.aproximada
        ? 'Ubicación aproximada'
        : `${lugar.latitud?.toFixed(5)}, ${lugar.longitud?.toFixed(5)}`;

  return (
    <Pantalla>
      <Tarjeta>
        <Titulo>{reporte.titulo}</Titulo>
        <Texto>{reporte.descripcion || 'Sin descripción'}</Texto>
        <Texto suave>
          {reporte.categoria} · {reporte.aula || 'sin aula'}
        </Texto>
        <Texto suave>{textoLugar}</Texto>
        <Texto>Estado: {reporte.estado}</Texto>
      </Tarjeta>
      {reporte.foto && <Image source={{ uri: reporte.foto }} style={estilos.foto} />}
      {reporte.estado !== 'resuelto' && (
        <Boton secundario titulo="Simular resolución" onPress={() => simularResolucion(reporte.id)} />
      )}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({ foto: { width: '100%', height: 240, borderRadius: 8 } });
