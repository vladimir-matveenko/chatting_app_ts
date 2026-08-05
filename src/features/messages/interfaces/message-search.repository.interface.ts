import { MessageSearchResult } from "../models/message-search.model.js";

export interface IMessageSearchRepository {
  search(chatId: string, query: string, limit: number): Promise<MessageSearchResult[]>;
}
