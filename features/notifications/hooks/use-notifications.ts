import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Notification } from '../types/notification.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchNotifications = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const response = await apiClient.get<Notification[]>(`/users/${user.id}/notifications`, token);
      setNotifications(response);
    } catch {
      setNotifications([
        { id: '1', type: 'dose_reminder', title: 'Lembrete de dose', body: 'Está na hora de tomar Atorvastatina 0.90', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), actionLabel: 'Confirmar' },
        { id: '2', type: 'dose_confirmed', title: 'Vitamina D confirmada', body: 'Dose das 09:00 registrada com sucesso.', read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: '3', type: 'weekly_report', title: 'Relatório Semanal', body: 'Sua adesão esta semana foi de 85%.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: '4', type: 'dose_confirmed', title: 'Lisinapril confirmada', body: 'Dose das 20:00 registrada com sucesso.', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  async function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    try {
      await apiClient.patch(`/users/${user?.id}/notifications/${id}/read`, {}, token ?? undefined);
    } catch { /* silently fail */ }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, markAsRead, unreadCount };
}
