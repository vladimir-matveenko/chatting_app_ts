export const RegisterRequest = {
  type: "object",

  required: ["userName", "email", "password"],

  properties: {
    userName: {
      type: "string",

      example: "john",
    },

    email: {
      type: "string",

      format: "email",

      example: "john@example.com",
    },

    password: {
      type: "string",

      example: "Password123!",
    },
  },
};
