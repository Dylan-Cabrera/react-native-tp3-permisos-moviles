import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { Boton, Pantalla, Texto } from '@/components/ui';
import { usePermiso } from '@/hooks/usePermiso';
import { useReportes } from '@/lib/reportes';

export default function Foto() {
  const router = useRouter();
  const { borrador, editarBorrador } = useReportes();
  const camara = usePermiso('camara');

  const guardar = (resultado: ImagePicker.ImagePickerResult) => {
    if (!resultado.canceled) editarBorrador({ foto: resultado.assets[0].uri });
  };

  const sacarFoto = async () => {
    if (camara.estado !== 'concedido') {
      router.push('/permisos/camara');
      return;
    }
    guardar(await ImagePicker.launchCameraAsync({ quality: 0.7 }));
  };

  // El selector del sistema no necesita permiso de galería.
  const elegirDeGaleria = async () => {
    guardar(await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 }));
  };

  return (
    <Pantalla>
      <Boton titulo="Sacar foto" onPress={sacarFoto} />
      <Boton secundario titulo="Elegir de la galería" onPress={elegirDeGaleria} />
      {borrador.foto ? (
        <Image source={{ uri: borrador.foto }} style={estilos.foto} />
      ) : (
        <Texto suave>Todavía no hay foto.</Texto>
      )}
      <Boton secundario titulo="Listo" onPress={() => router.back()} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({ foto: { width: '100%', height: 240, borderRadius: 8 } });
