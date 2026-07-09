import { ChatType } from "./chat-type.enum.js";

export interface ChatEntity {
  id: string;

  type: ChatType;

  title: string | null;

  avatar_url: string | null;

  owner_id: string | null;

  created_at: Date;

  updated_at: Date;
}
