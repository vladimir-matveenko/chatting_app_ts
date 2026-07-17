export const ChangeMemberRoleRequestSchema = {
  ChangeMemberRoleRequest: {
    type: "object",

    required: ["role"],

    properties: {
      role: {
        $ref: "#/components/schemas/ChatMemberRole",
      },
    },
  },
};
