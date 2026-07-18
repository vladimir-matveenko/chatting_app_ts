export class SocketRoomBuilder {
  static user(userId: string): string {
    return `user:${userId}`;
  }

  static chat(chatId: string): string {
    return `chat:${chatId}`;
  }
}
