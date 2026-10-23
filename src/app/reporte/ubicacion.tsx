import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Boton, Pantalla, Texto } from '@/components/ui';
import { usePermiso } from '@/hooks/usePermiso';
import { SECTORES, useReportes } from '@/lib/reportes';
import { obtenerUbicacion } from '@/lib/ubicacion';

export default function Ubicacion() {
  const router = useRouter();
  const { borrador, editarBorrador } = useReportes();
  const { estado } = usePermiso('ubicacion');
  const [aviso, setAviso] = useState('');

  const usarMiUbicacion = async () => {
    if (estado !== 'concedido') {
      router.push('/permisos/ubicacion');
      return;
    }
    const ubicacion = await obtenerUbicacion();
    if (!ubicacion) {
      setAviso('No pudimos leer tu ubicación. Elegí el sector a mano.');
      return;
    }
    setAviso('');
    editarBorrador({ lugar: ubicacion });
  };

  const lugar = borrador.lugar;

  return (
    <Pantalla>
      <Boton titulo="Usar mi ubicación" onPress={usarMiUbicacion} />
      {aviso !== '' && <Texto suave>{aviso}</Texto>}
      <Texto suave>O elegí el sector a mano:</Texto>
      {SECTORES.map((s) => (
        <Boton
          key={s}
          secundario={lugar?.sector !== s}
          titulo={s}
          onPress={() => editarBorrador({ lugar: { sector: s } })}
        />
      ))}
      {lugar && (
        <Texto>
          {lugar.sector
            ? `Sector: ${lugar.sector}`
            : lugar.aproximada
              ? 'Ubicación aproximada'
              : `${lugar.latitud?.toFixed(5)}, ${lugar.longitud?.toFixed(5)}`}
        </Texto>
      )}
      <Boton secundario titulo="Listo" onPress={() => router.back()} />
    </Pantalla>
  );
}
