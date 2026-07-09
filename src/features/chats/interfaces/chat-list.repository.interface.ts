import type { ChatListItem } from "../models/chat-list-item.model.js";

export interface IChatListRepository {
  findByUser(userId: string): Promise<ChatListItem[]>;
}
