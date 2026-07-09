export const logoutPath = {
  "/auth/logout": {
    post: {
      tags: ["Auth"],

      summary: "Logout",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        "204": {
          description: "Logged out.",
        },
      },
    },
  },
};
