import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { consultar, solicitar, type Estado, type Lectura, type Recurso } from '@/lib/permisos';

import { useRevisarAlVolver } from './useRevisarAlVolver';

export function usePermiso(recurso: Recurso) {
  const [lectura, setLectura] = useState<Lectura | null>(null);

  const revisar = useCallback(async () => {
    setLectura(await consultar(recurso));
  }, [recurso]);

  const pedir = useCallback(async () => {
    const nueva = await solicitar(recurso);
    setLectura(nueva);
    return nueva.estado;
  }, [recurso]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  useEffect(() => {
    revisar();
  }, [revisar]);

  // Al volver de otra pantalla (por ejemplo, la pantalla previa).
  useFocusEffect(
    useCallback(() => {
      revisar();
    }, [revisar]),
  );

  // Al volver de Ajustes.
  useRevisarAlVolver(revisar);

  const estado: Estado = lectura?.estado ?? 'cargando';
  return {
    estado,
    parcial: lectura?.parcial ?? false,
    detalle: lectura?.detalle,
    pedir,
    abrirAjustes,
    revisar,
  };
}
