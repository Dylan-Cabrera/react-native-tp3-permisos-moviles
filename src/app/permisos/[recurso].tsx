import { useLocalSearchParams, useRouter } from 'expo-router';

import { PrevioPermiso } from '@/components/PrevioPermiso';
import { Pantalla, Texto } from '@/components/ui';
import { RECURSOS, type Recurso } from '@/lib/permisos';

export default function PantallaPrevia() {
  const router = useRouter();
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  if (!RECURSOS.includes(recurso as Recurso)) {
    return (
      <Pantalla>
        <Texto>Ese permiso no existe.</Texto>
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <PrevioPermiso recurso={recurso as Recurso} alResolver={() => router.back()} />
    </Pantalla>
  );
}
