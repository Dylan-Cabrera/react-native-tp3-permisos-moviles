import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { notificacionesConcedidas, programarAviso } from './notificaciones';

export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';
export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export const CATEGORIAS: Categoria[] = ['electricidad', 'agua', 'mobiliario', 'equipos'];
export const SECTORES = ['Patio', 'Estacionamiento', 'Pasillo'];

export type Lugar = {
  sector?: string;
  latitud?: number;
  longitud?: number;
  aproximada?: boolean;
};

export type Borrador = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  foto?: string;
  lugar?: Lugar;
};

export type Reporte = Borrador & { id: string; estado: EstadoReporte };
export type Aviso = { id: string; texto: string };

const BORRADOR_VACIO: Borrador = { titulo: '', descripcion: '', aula: '', categoria: 'electricidad' };

type Contexto = {
  reportes: Reporte[];
  avisos: Aviso[];
  borrador: Borrador;
  avisosActivados: boolean;
  editarBorrador: (cambios: Partial<Borrador>) => void;
  guardarBorrador: () => string;
  activarAvisos: (valor: boolean) => void;
  simularResolucion: (id: string) => Promise<void>;
};

const ReportesContext = createContext<Contexto | null>(null);

export function ReportesProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO);
  const [avisosActivados, activarAvisos] = useState(false);

  const editarBorrador = useCallback((cambios: Partial<Borrador>) => {
    setBorrador((actual) => ({ ...actual, ...cambios }));
  }, []);

  const guardarBorrador = useCallback(() => {
    const id = String(Date.now());
    setReportes((actuales) => [{ ...borrador, id, estado: 'pendiente' }, ...actuales]);
    setBorrador(BORRADOR_VACIO);
    return id;
  }, [borrador]);

  // A los 10 segundos el reporte queda resuelto. Si hay permiso y el interruptor
  // está activo se programa una notificación; el aviso siempre llega a la bandeja.
  const simularResolucion = useCallback(
    async (id: string) => {
      const reporte = reportes.find((r) => r.id === id);
      if (!reporte) return;
      const texto = `Se resolvió tu reporte "${reporte.titulo}".`;

      if (avisosActivados && (await notificacionesConcedidas())) {
        await programarAviso('Reporte resuelto', texto, 10);
      }
      setTimeout(() => {
        setReportes((actuales) => actuales.map((r) => (r.id === id ? { ...r, estado: 'resuelto' } : r)));
        setAvisos((actuales) => [{ id: String(Date.now()), texto }, ...actuales]);
      }, 10_000);
    },
    [reportes, avisosActivados],
  );

  const valor = useMemo(
    () => ({
      reportes,
      avisos,
      borrador,
      avisosActivados,
      editarBorrador,
      guardarBorrador,
      activarAvisos,
      simularResolucion,
    }),
    [reportes, avisos, borrador, avisosActivados, editarBorrador, guardarBorrador, simularResolucion],
  );

  return <ReportesContext.Provider value={valor}>{children}</ReportesContext.Provider>;
}

export function useReportes() {
  const contexto = useContext(ReportesContext);
  if (!contexto) throw new Error('useReportes debe usarse dentro de ReportesProvider');
  return contexto;
}
