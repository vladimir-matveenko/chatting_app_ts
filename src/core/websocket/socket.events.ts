export const SocketEvents = {
  // Client -> Server

  JoinChat: "chat:join",

  LeaveChat: "chat:leave",

  TypingStart: "typing:start",

  TypingStop: "typing:stop",

  // Server -> Client

  MessageCreated: "message:created",

  MessageUpdated: "message:updated",

  MessageDeleted: "message:deleted",

  MessagePinned: "message:pinned",

  MessageUnpinned: "message:unpinned",

  ReactionUpdated: "reaction:updated",

  MessageRead: "message:read",

  TypingStarted: "typing:started",

  TypingStopped: "typing:stopped",

  Exception: "exception",
} as const;
