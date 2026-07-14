import { noContentResponse } from "../../../../swagger/builders/index.js";

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
        204: noContentResponse("Logged out."),
      },
    },
  },
};
