import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_SCHEDULE } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { ScheduleSection } from '../types/schedule.types';

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
      const date = selectedDate.toISOString().split('T')[0];
      const response = await apiClient.get<ScheduleSection[]>(API_ROUTES.users.schedule(user?.id ?? '', date), token ?? undefined);
      setSections(response);
    } catch {
      setSections(MOCK_SCHEDULE);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, user?.id, token]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  return { sections, loading, selectedDate, setSelectedDate, refetch: fetchSchedule };
}
