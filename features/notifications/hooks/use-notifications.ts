import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_NOTIFICATIONS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Notification } from '../types/notification.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setNotifications(MOCK_NOTIFICATIONS);
        return;
      }
      // Não existe endpoint de listagem de notificações no backend (só um
      // toggle on/off em POST /users/{id}/notifications) — esta chamada
      // sempre falha hoje. Erro real, não mascarar com mock.
      const response = await apiClient.get<Notification[] | null>(API_ROUTES.users.notifications(user?.id ?? ''), token ?? undefined);
      setNotifications(response ?? []);
    } catch (err) {
      setNotifications([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    if (!USE_MOCK) {
      apiClient.patch(API_ROUTES.users.notificationRead(user?.id ?? '', id), {}, token ?? undefined).catch(() => {});
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, error, markAsRead, unreadCount };
}
