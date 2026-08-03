import { MessageSearchEntity } from "../entities/message-search.entity.js";
import { MessageSearchResult } from "../models/message-search.model.js";
import { MessagesQueries } from "../queries/messages.queries.js";
import { Database } from "../../../core/database/database.js";
import { MessagesSearchMapper } from "../mappers/messages-search.mapper.js";

export class MessageSearchRepository {
  constructor(
    private readonly db: Database,

    private readonly mapper: MessagesSearchMapper,
  ) {}

  async search(chatId: string, query: string, limit: number): Promise<MessageSearchResult[]> {
    const result = await this.db.query<MessageSearchEntity>(MessagesQueries.SEARCH, [
      chatId,
      query,
      limit,
    ]);

    return this.mapper.mapMany(result.rows);
  }
}
