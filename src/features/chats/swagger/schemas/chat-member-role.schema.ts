export const ChatMemberRoleSchema = {
  ChatMemberRole: {
    type: "string",

    enum: ["owner", "admin", "member"],
  },
};
