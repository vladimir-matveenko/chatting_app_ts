import { FindUsersDto } from "../../users/dto/find-users.dto.js";
import type { ChatListItem } from "../models/chat-list-item.model.js";

export interface IChatListRepository {
  findByUser(userId: string, dto: FindUsersDto): Promise<ChatListItem[]>;

  findArchivedByUser(userId: string, dto: FindUsersDto): Promise<ChatListItem[]>;
}
