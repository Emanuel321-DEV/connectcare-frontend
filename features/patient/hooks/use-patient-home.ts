import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_HOME } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { isSameLocalDay } from '@/shared/utils/time';
import type { DoseItem, PatientHomeData } from '../types/schedule.types';

// Não existe endpoint /home no backend. Montamos o resumo a partir de
// GET /users/{userId}/doses (ver docs/api.yaml, schema ScheduledDose) — esse
// endpoint já mescla doses futuras previstas com o histórico real, então
// "Doses de Hoje" mostra também as que ainda não venceram, não só as passadas.
interface RawScheduledDose {
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  dose_record_id?: string;
  confirmed_at?: string | null;
}

function buildHomeData(records: RawScheduledDose[]): PatientHomeData {
  const today = new Date();
  const todayRecords = records.filter((r) => isSameLocalDay(r.scheduled_at, today));

  const todayDoses: DoseItem[] = todayRecords.map((r) => ({
    id: r.dose_record_id ?? `${r.prescription_id}-${r.scheduled_at}`,
    prescriptionId: r.prescription_id,
    medicamentName: r.medicament_name,
    dosage: r.dosage,
    scheduledTime: new Date(r.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: r.status === 'TAKEN' ? 'taken' : r.status === 'MISSED' ? 'skipped' : 'pending',
    takenAt: r.confirmed_at ?? undefined,
    doseRecordId: r.dose_record_id,
  }));

  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const pendingCount = todayDoses.filter((d) => d.status === 'pending').length;
  const skippedCount = todayDoses.filter((d) => d.status === 'skipped').length;

  // /doses inclui dose futura prevista (ainda não venceu) — essa não pode
  // contar contra a adesão. Só entra no cálculo quem já devia ter acontecido:
  // TAKEN, MISSED, ou PENDING com scheduled_at no passado (venceu e ninguém
  // confirmou nem pulou).
  const now = new Date();
  const dueRecords = records.filter(
    (r) => r.status === 'TAKEN' || r.status === 'MISSED' || new Date(r.scheduled_at) <= now
  );
  const totalTaken = dueRecords.filter((r) => r.status === 'TAKEN').length;
  const adherencePercentage = dueRecords.length > 0 ? Math.round((totalTaken / dueRecords.length) * 100) : 0;

  return { adherencePercentage, todayDoses, takenCount, pendingCount, skippedCount };
}

export function usePatientHome() {
  const [data, setData] = useState<PatientHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setData(MOCK_PATIENT_HOME);
        return;
      }
      const records = await apiClient.get<RawScheduledDose[] | null>(
        API_ROUTES.users.doseSchedule(user?.id ?? ''),
        token ?? undefined
      );
      setData(buildHomeData(records ?? []));
    } catch (err) {
      // Erro real do backend — não mascarar com dado mockado.
      setData(null);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Refaz a busca sempre que a tela ganha foco (ex: ao voltar de outra tela),
  // já que o efeito de mount não roda de novo nesse caso e o estado ficaria desatualizado.
  useFocusEffect(
    useCallback(() => { fetchData(); }, [fetchData])
  );

  return { data, loading, error, refetch: fetchData, user };
}
