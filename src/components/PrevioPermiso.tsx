import { View } from 'react-native';

import { usePermiso } from '@/hooks/usePermiso';
import { INFO, type Estado, type Recurso } from '@/lib/permisos';

import { Boton, Texto, Titulo } from './ui';

// Pantalla previa al diálogo del sistema. Un solo botón: "Continuar", o
// "Abrir Ajustes" si el permiso está bloqueado. Sin "Ahora no" ni "Cerrar".
export function PrevioPermiso({
  recurso,
  alResolver,
}: {
  recurso: Recurso;
  alResolver?: (estado: Estado) => void;
}) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const info = INFO[recurso];

  if (estado === 'cargando') return <Texto suave>Cargando…</Texto>;

  if (estado === 'concedido') return <Texto>El permiso de {info.titulo.toLowerCase()} ya está concedido.</Texto>;

  if (estado === 'bloqueado') {
    return (
      <View style={{ gap: 12 }}>
        <Titulo>{info.titulo} bloqueada</Titulo>
        <Texto>{info.beneficio}</Texto>
        <Texto suave>Para habilitarla andá a: {info.ajustes}</Texto>
        <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Titulo>{info.titulo}</Titulo>
      <Texto>{info.beneficio}</Texto>
      <Texto suave>Podés cambiar esta decisión cuando quieras desde Ajustes.</Texto>
      <Boton
        titulo="Continuar"
        onPress={async () => {
          const nuevo = await pedir();
          alResolver?.(nuevo);
        }}
      />
    </View>
  );
}
