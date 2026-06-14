export type NotificationType = 'dose_reminder' | 'dose_confirmed' | 'weekly_report' | 'low_adherence';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionLabel?: string;
}
