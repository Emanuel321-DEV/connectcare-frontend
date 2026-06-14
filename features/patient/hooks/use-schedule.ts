import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { ScheduleSection } from '../types/schedule.types';

export function useSchedule() {
  const [sections, setSections] = useState<ScheduleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchSchedule = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const date = selectedDate.toISOString().split('T')[0];
      const response = await apiClient.get<ScheduleSection[]>(`/users/${user.id}/schedule?date=${date}`, token);
      setSections(response);
    } catch {
      setSections([
        {
          label: 'Manhã',
          timeRange: '09:00',
          doses: [
            { id: '1', prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', scheduledTime: '09:00', status: 'taken' },
          ],
        },
        {
          label: 'Tarde',
          timeRange: '13:00',
          doses: [
            { id: '2', prescriptionId: 'p3', medicamentName: 'Metformina', dosage: '1 comprimido', scheduledTime: '13:00', status: 'pending' },
            { id: '3', prescriptionId: 'p4', medicamentName: 'Insulina', dosage: '10 unidades', scheduledTime: '13:00', status: 'pending' },
          ],
        },
        {
          label: 'Noite',
          timeRange: '20:00',
          doses: [
            { id: '4', prescriptionId: 'p5', medicamentName: 'Gliosatidase', dosage: '1 comprimido', scheduledTime: '20:00', status: 'pending' },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token, user, selectedDate]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  return { sections, loading, selectedDate, setSelectedDate, refetch: fetchSchedule };
}
