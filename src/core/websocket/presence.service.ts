export class PresenceService {
  private readonly connections = new Map<string, number>();

  connect(userId: string): boolean {
    const count = this.connections.get(userId) ?? 0;

    this.connections.set(userId, count + 1);

    return count === 0;
  }

  disconnect(userId: string): boolean {
    const count = this.connections.get(userId);

    if (!count) {
      return false;
    }

    if (count === 1) {
      this.connections.delete(userId);

      return true;
    }

    this.connections.set(userId, count - 1);

    return false;
  }

  isOnline(userId: string): boolean {
    return this.connections.has(userId);
  }
}
