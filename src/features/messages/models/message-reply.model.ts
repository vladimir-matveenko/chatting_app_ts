export interface MessageReply {
  id: string;

  senderId: string;

  body: string | null;

  type: string;

  deletedAt: Date | null;
}
