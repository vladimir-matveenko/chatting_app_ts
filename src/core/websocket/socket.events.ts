export const SocketEvents = {
  JoinChat: "chat:join",

  LeaveChat: "chat:leave",

  TypingStart: "typing:start",

  TypingStop: "typing:stop",

  MessageCreated: "message:created",

  MessageUpdated: "message:updated",

  MessageDeleted: "message:deleted",

  MessagePinned: "message:pinned",

  MessageUnpinned: "message:unpinned",

  ReactionUpdated: "reaction:updated",

  MessageRead: "message:read",

  Exception: "exception",
} as const;
