import { useRouter } from 'expo-router';
import { Image, StyleSheet, TextInput } from 'react-native';

import { Boton, colores, Pantalla, Texto } from '@/components/ui';
import { CATEGORIAS, useReportes } from '@/lib/reportes';

export default function NuevoReporte() {
  const router = useRouter();
  const { borrador, editarBorrador, guardarBorrador } = useReportes();

  const guardar = () => {
    guardarBorrador();
    router.dismissTo('/');
  };

  return (
    <Pantalla>
      <TextInput
        style={estilos.campo}
        placeholder="Título"
        value={borrador.titulo}
        onChangeText={(titulo) => editarBorrador({ titulo })}
      />
      <TextInput
        style={[estilos.campo, { height: 90 }]}
        placeholder="Descripción"
        multiline
        value={borrador.descripcion}
        onChangeText={(descripcion) => editarBorrador({ descripcion })}
      />
      <TextInput
        style={estilos.campo}
        placeholder="Aula"
        value={borrador.aula}
        onChangeText={(aula) => editarBorrador({ aula })}
      />
      <Texto suave>Categoría</Texto>
      {CATEGORIAS.map((c) => (
        <Boton
          key={c}
          secundario={borrador.categoria !== c}
          titulo={c}
          onPress={() => editarBorrador({ categoria: c })}
        />
      ))}
      <Boton secundario titulo="Escanear QR del aula" onPress={() => router.push('/reporte/escanear')} />
      <Boton secundario titulo="Adjuntar foto" onPress={() => router.push('/reporte/foto')} />
      {borrador.foto && <Image source={{ uri: borrador.foto }} style={estilos.foto} />}
      <Boton secundario titulo="Marcar ubicación" onPress={() => router.push('/reporte/ubicacion')} />
      {borrador.lugar && <Texto suave>Ubicación cargada.</Texto>}
      {borrador.titulo.trim() !== '' && <Boton titulo="Guardar reporte" onPress={guardar} />}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  campo: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  foto: { width: '100%', height: 180, borderRadius: 8 },
});
