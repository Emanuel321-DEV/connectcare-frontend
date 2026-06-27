import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_NOTIFICATIONS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Notification } from '../types/notification.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setNotifications(MOCK_NOTIFICATIONS);
        return;
      }
      const response = await apiClient.get<Notification[]>(`/users/${user?.id}/notifications`, token ?? undefined);
      setNotifications(response);
    } catch {
      setNotifications(MOCK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    if (!USE_MOCK) {
      apiClient.patch(`/users/${user?.id}/notifications/${id}/read`, {}, token ?? undefined).catch(() => {});
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, markAsRead, unreadCount };
}
