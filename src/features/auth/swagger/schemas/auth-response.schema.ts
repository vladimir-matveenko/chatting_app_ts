export const AuthResponse = {
  type: "object",

  properties: {
    user: {
      $ref: "#/components/schemas/User",
    },

    tokens: {
      $ref: "#/components/schemas/TokenResponse",
    },
  },
};
