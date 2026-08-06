export interface NotificationPayload {
  chatId?: string;

  messageId?: string;

  senderId?: string;

  memberId?: string;

  [key: string]: unknown;
}
