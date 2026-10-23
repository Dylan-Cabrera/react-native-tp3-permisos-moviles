import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export const colores = {
  fondo: '#f5f7fa',
  texto: '#1c2430',
  suave: '#5b6675',
  principal: '#1d5fd1',
  borde: '#d5dbe3',
  blanco: '#ffffff',
};

export function Pantalla({ children }: { children: ReactNode }) {
  return <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>{children}</ScrollView>;
}

export function Titulo({ children }: { children: ReactNode }) {
  return <Text style={estilos.titulo}>{children}</Text>;
}

export function Texto({ children, suave }: { children: ReactNode; suave?: boolean }) {
  return <Text style={[estilos.texto, suave && { color: colores.suave }]}>{children}</Text>;
}

export function Boton({
  titulo,
  onPress,
  secundario,
}: {
  titulo: string;
  onPress: () => void;
  secundario?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[estilos.boton, secundario && estilos.botonSecundario]}
      accessibilityRole="button"
    >
      <Text style={[estilos.botonTexto, secundario && { color: colores.principal }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Tarjeta({ children }: { children: ReactNode }) {
  return <View style={estilos.tarjeta}>{children}</View>;
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: 16, gap: 12 },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.texto },
  texto: { fontSize: 16, color: colores.texto },
  boton: {
    backgroundColor: colores.principal,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.principal,
  },
  botonSecundario: { backgroundColor: colores.blanco },
  botonTexto: { color: colores.blanco, fontSize: 16, fontWeight: '600' },
  tarjeta: {
    backgroundColor: colores.blanco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 12,
    gap: 6,
  },
});
