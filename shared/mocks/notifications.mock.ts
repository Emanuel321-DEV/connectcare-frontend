import type { Notification } from '@/features/notifications/types/notification.types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'dose_reminder', title: 'Lembrete de dose', body: 'Está na hora de tomar Atorvastatina 0.90', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), actionLabel: 'Confirmar' },
  { id: '2', type: 'dose_confirmed', title: 'Vitamina D confirmada', body: 'Dose das 09:00 registrada com sucesso.', read: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', type: 'weekly_report', title: 'Relatório Semanal', body: 'Sua adesão esta semana foi de 85%.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', type: 'dose_confirmed', title: 'Lisinapril confirmada', body: 'Dose das 20:00 registrada com sucesso.', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];
