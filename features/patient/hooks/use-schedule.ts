import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_SCHEDULE } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { isSameLocalDay } from '@/shared/utils/time';
import type { DoseItem, DoseStatus, ScheduleSection } from '../types/schedule.types';

// Formato real devolvido por GET /users/{userId}/doses (ver docs/api.yaml no
// repositório do backend, schema ScheduledDose). Diferente do antigo
// /dose-records, esse endpoint já mescla doses futuras previstas (calculadas
// a partir da prescrição) com o histórico real — por isso a Agenda passa a
// mostrar doses de hoje/futuras antes delas vencerem, não só depois.
interface RawScheduledDose {
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  // Ausente quando a dose é só uma previsão (ainda não venceu, não existe
  // dose_record real no backend) — nesse caso não dá pra confirmar/pular.
  dose_record_id?: string;
  confirmed_at?: string | null;
}

const STATUS_MAP: Record<RawScheduledDose['status'], DoseStatus> = {
  PENDING: 'pending',
  TAKEN: 'taken',
  MISSED: 'skipped',
};

function toDoseItem(dose: RawScheduledDose): DoseItem {
  const scheduledTime = new Date(dose.scheduled_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return {
    id: dose.dose_record_id ?? `${dose.prescription_id}-${dose.scheduled_at}`,
    prescriptionId: dose.prescription_id,
    medicamentName: dose.medicament_name,
    dosage: dose.dosage,
    scheduledTime,
    status: STATUS_MAP[dose.status],
    takenAt: dose.confirmed_at ?? undefined,
    doseRecordId: dose.dose_record_id,
  };
}

function groupIntoSections(doses: DoseItem[]): ScheduleSection[] {
  const buckets: { label: string; timeRange: string; test: (hour: number) => boolean }[] = [
    { label: 'Manhã', timeRange: '05:00 - 12:00', test: (h) => h >= 5 && h < 12 },
    { label: 'Tarde', timeRange: '12:00 - 18:00', test: (h) => h >= 12 && h < 18 },
    { label: 'Noite', timeRange: '18:00 - 05:00', test: (h) => h >= 18 || h < 5 },
  ];

  return buckets
    .map(({ label, timeRange, test }) => ({
      label,
      timeRange,
      doses: doses
        .filter((d) => test(Number(d.scheduledTime.split(':')[0])))
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)),
    }))
    .filter((section) => section.doses.length > 0);
}

// patientId: usado pelo cuidador pra ver a agenda de um paciente vinculado.
// Quando omitido, usa o próprio usuário logado (fluxo do paciente).
export function useSchedule(patientId?: string) {
  const [sections, setSections] = useState<ScheduleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const targetUserId = patientId ?? user?.id;

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setSections(MOCK_SCHEDULE);
        return;
      }
      const records = await apiClient.get<RawScheduledDose[] | null>(
        API_ROUTES.users.doseSchedule(targetUserId ?? ''),
        token ?? undefined
      );
      const doses = (records ?? [])
        .filter((r) => isSameLocalDay(r.scheduled_at, selectedDate))
        .map(toDoseItem);
      setSections(groupIntoSections(doses));
    } catch (err) {
      // Erro real do backend — não mascarar com dado mockado.
      setSections([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o cronograma.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, targetUserId, token]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  // Refaz a busca sempre que a tela ganha foco (ex: ao voltar de outra tela),
  // já que o efeito de mount não roda de novo nesse caso e o estado ficaria desatualizado.
  useFocusEffect(
    useCallback(() => { fetchSchedule(); }, [fetchSchedule])
  );

  return { sections, loading, error, selectedDate, setSelectedDate, refetch: fetchSchedule };
}
