import { useRouter } from 'expo-router';

import { Boton, Pantalla, Tarjeta, Texto, Titulo } from '@/components/ui';
import { useReportes } from '@/lib/reportes';

export default function Inicio() {
  const router = useRouter();
  const { reportes } = useReportes();

  return (
    <Pantalla>
      <Boton titulo="Nuevo reporte" onPress={() => router.push('/reporte/nuevo')} />
      {reportes.length === 0 && <Texto suave>Todavía no cargaste ningún reporte.</Texto>}
      {reportes.map((r) => (
        <Tarjeta key={r.id}>
          <Titulo>{r.titulo}</Titulo>
          <Texto suave>
            {r.categoria} · {r.aula || 'sin aula'} · {r.estado}
          </Texto>
          <Boton secundario titulo="Ver detalle" onPress={() => router.push(`/reporte/${r.id}`)} />
        </Tarjeta>
      ))}
    </Pantalla>
  );
}
