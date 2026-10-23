import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { Boton, Pantalla, Tarjeta, Texto, Titulo } from '@/components/ui';
import { usePermiso } from '@/hooks/usePermiso';
import { INFO, RECURSOS, type Recurso } from '@/lib/permisos';

function FilaPermiso({ recurso }: { recurso: Recurso }) {
  const router = useRouter();
  const { estado, parcial, detalle, abrirAjustes } = usePermiso(recurso);

  return (
    <Tarjeta>
      <Titulo>{INFO[recurso].titulo}</Titulo>
      <Texto>
        Estado: {estado}
        {parcial ? ' (parcial)' : ''}
      </Texto>
      <Texto suave>
        Plataforma: {Platform.OS}
        {detalle ? ` · ${detalle}` : ''}
      </Texto>
      {estado === 'preguntable' && <Boton titulo="Pedir" onPress={() => router.push(`/permisos/${recurso}`)} />}
      {estado === 'bloqueado' && <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />}
    </Tarjeta>
  );
}

export default function Permisos() {
  const router = useRouter();

  return (
    <Pantalla>
      {RECURSOS.map((r) => (
        <FilaPermiso key={r} recurso={r} />
      ))}
      <Tarjeta>
        <Titulo>Galería</Titulo>
        <Texto suave>No se pide permiso: las fotos se eligen con el selector del sistema.</Texto>
      </Tarjeta>
      <Boton secundario titulo="Ajustes de la app" onPress={() => router.push('/ajustes-app')} />
    </Pantalla>
  );
}
