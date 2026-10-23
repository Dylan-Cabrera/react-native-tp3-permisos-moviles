import { Pantalla, Tarjeta, Texto } from '@/components/ui';
import { useReportes } from '@/lib/reportes';

export default function Avisos() {
  const { avisos } = useReportes();

  return (
    <Pantalla>
      {avisos.length === 0 && <Texto suave>No tenés avisos.</Texto>}
      {avisos.map((a) => (
        <Tarjeta key={a.id}>
          <Texto>{a.texto}</Texto>
        </Tarjeta>
      ))}
    </Pantalla>
  );
}
