import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Pantalla, Tarjeta, Texto } from '@/components/ui';
import { useReportes } from '@/lib/reportes';
import { usePermiso } from '@/hooks/usePermiso';

export default function AjustesApp() {
  const router = useRouter();
  const { avisosActivados, activarAvisos } = useReportes();
  const { estado } = usePermiso('notificaciones');
  const activo = avisosActivados && estado === 'concedido';
  const pendiente = useRef(false);

  // Si se pidió el permiso desde la pantalla previa y ahora está concedido, se activa.
  if (pendiente.current && estado === 'concedido') {
    pendiente.current = false;
    activarAvisos(true);
  }

  const cambiar = (valor: boolean) => {
    if (!valor) return activarAvisos(false);
    if (estado === 'concedido') return activarAvisos(true);
    pendiente.current = true;
    router.push('/permisos/notificaciones');
  };

  return (
    <Pantalla>
      <Tarjeta>
        <View style={estilos.fila}>
          <Texto>Avisarme cuando se resuelva mi reporte</Texto>
          <Switch value={activo} onValueChange={cambiar} />
        </View>
        {estado === 'bloqueado' && <Texto suave>Las notificaciones están bloqueadas: los avisos llegan a la pestaña Avisos.</Texto>}
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({ fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 } });
