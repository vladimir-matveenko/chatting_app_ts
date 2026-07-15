export const ChatListParticipantSchema = {
  ChatListParticipant: {
    type: "object",

    properties: {
      userName: {
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
