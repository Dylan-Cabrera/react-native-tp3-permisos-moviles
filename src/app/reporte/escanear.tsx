import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { PrevioPermiso } from '@/components/PrevioPermiso';
import { Boton, colores, Pantalla, Texto } from '@/components/ui';
import { usePermiso } from '@/hooks/usePermiso';
import { useReportes } from '@/lib/reportes';

export default function Escanear() {
  const router = useRouter();
  const { editarBorrador } = useReportes();
  const { estado } = usePermiso('camara');
  const [codigo, setCodigo] = useState('');

  const usarAula = (aula: string) => {
    editarBorrador({ aula });
    router.back();
  };

  if (estado === 'cargando') {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator />
      </View>
    );
  }

  if (estado === 'concedido') {
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => usarAula(data)}
      />
    );
  }

  // Preguntable o bloqueado: la explicación y, siempre, el código a mano.
  return (
    <Pantalla>
      <PrevioPermiso recurso="camara" />
      <Texto suave>Si preferís, escribí el código del aula a mano:</Texto>
      <TextInput style={estilos.campo} placeholder="Aula" value={codigo} onChangeText={setCodigo} />
      {codigo.trim() !== '' && <Boton secundario titulo="Usar este código" onPress={() => usarAula(codigo.trim())} />}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  campo: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
