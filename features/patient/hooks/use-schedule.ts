import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_SCHEDULE } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { DoseItem, DoseStatus, ScheduleSection } from '../types/schedule.types';

// Formato real devolvido por GET /users/{userId}/dose-records (ver docs/api.yaml
// no repositório do backend, schema DoseRecord). Não existe endpoint /schedule.
interface RawDoseRecord {
  id: string;
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  confirmed_at: string | null;
}

const STATUS_MAP: Record<RawDoseRecord['status'], DoseStatus> = {
  PENDING: 'pending',
  TAKEN: 'taken',
  MISSED: 'skipped',
};

function toDoseItem(record: RawDoseRecord): DoseItem {
  const scheduledTime = new Date(record.scheduled_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return {
    id: record.id,
    prescriptionId: record.prescription_id,
    medicamentName: record.medicament_name,
    dosage: record.dosage,
    scheduledTime,
    status: STATUS_MAP[record.status],
    takenAt: record.confirmed_at ?? undefined,
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
      doses: doses.filter((d) => test(Number(d.scheduledTime.split(':')[0]))),
    }))
    .filter((section) => section.doses.length > 0);
}

export function useSchedule() {
  const [sections, setSections] = useState<ScheduleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setSections(MOCK_SCHEDULE);
        return;
      }
      const records = await apiClient.get<RawDoseRecord[] | null>(
        API_ROUTES.users.doseRecords(user?.id ?? ''),
        token ?? undefined
      );
      const dateStr = selectedDate.toISOString().split('T')[0];
      const doses = (records ?? [])
        .filter((r) => r.scheduled_at.startsWith(dateStr))
        .map(toDoseItem);
      setSections(groupIntoSections(doses));
    } catch {
      setSections(MOCK_SCHEDULE);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, user?.id, token]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  return { sections, loading, selectedDate, setSelectedDate, refetch: fetchSchedule };
}
