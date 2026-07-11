import type { Database } from "../../../core/database/database.js";

import { ChatReadsQueries } from "../queries/chat-reads.queries.js";

export class ChatReadsRepository {
  constructor(private readonly db: Database) {}

  async markRead(
    chatId: string,

    userId: string,

    messageId: string,
  ): Promise<void> {
    await this.db.query(
      ChatReadsQueries.MARK_READ,

      [chatId, userId, messageId],
    );
  }
}
