export const NotificationPayloadSchema = {
  NotificationPayload: {
    type: "object",
    additionalProperties: {},

    properties: {
      chatId: {
        $ref: "#/components/schemas/Id",
        nullable: true,
      },

      messageId: {
        $ref: "#/components/schemas/Id",
        nullable: true,
      },

      senderId: {
        $ref: "#/components/schemas/Id",
        nullable: true,
      },

      memberId: {
        $ref: "#/components/schemas/Id",
        nullable: true,
      },
    },
  },
};
