export const ChatListParticipantSchema = {
  ChatListParticipant: {
    type: "object",

    properties: {
      username: {
        type: "string",
      },

      displayName: {
        type: "string",

        nullable: true,
      },

      avatarUrl: {
        type: "string",

        nullable: true,
      },
    },
  },
};
