export interface ChatListItemEntity {
  id: string;

  type: string;

  title: string | null;

  avatar_url: string | null;

  owner_id: string;

  created_at: Date;

  updated_at: Date;

  last_message: string | null;

  last_message_at: Date | null;

  unread_count: number;
}
