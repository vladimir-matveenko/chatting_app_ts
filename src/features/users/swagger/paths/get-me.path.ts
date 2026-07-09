import { jsonResponse } from "../../../../swagger/builders/index.js";

export const getMePath = {
  "/users/me": {
    get: {
      tags: ["Users"],

      summary: "Get current user",

      responses: {
        "200": jsonResponse(
          "Current user.",

          "#/components/schemas/User",
        ),
      },
    },
  },
};
