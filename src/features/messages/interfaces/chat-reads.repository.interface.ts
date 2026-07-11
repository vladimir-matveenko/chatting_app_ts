export interface IChatReadsRepository {
  markRead(
    chatId: string,

    userId: string,

    messageId: string,
  ): Promise<void>;
}
