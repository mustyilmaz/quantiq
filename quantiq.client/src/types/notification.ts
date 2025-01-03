export type NotificationType = {
  message: string;
  type: 'success' | 'error';
} | null;

export interface WithNotificationProps {
  notification: NotificationType;
  onCloseNotification: () => void;
} 