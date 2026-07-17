export const TransferOwnershipRequestSchema = {
  TransferOwnershipRequest: {
    type: "object",

    required: ["userId"],

    properties: {
      userId: {
        $ref: "#/components/schemas/Id",
      },
    },
  },
};
