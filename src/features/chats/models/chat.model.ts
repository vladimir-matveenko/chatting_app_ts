export interface Chat {
  id: string;

  type: string;

  title: string | null;

  avatarUrl: string | null;

  ownerId: string | null;

  lastReadMessageId: string | null;

  createdAt: Date;

  updatedAt: Date;
}
