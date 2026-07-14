import { jsonRequest, okResponse } from "../../../../swagger/builders/index.js";

import { updateUserExample } from "../examples/index.js";

export const updateMePath = {
  "/users/me": {
    patch: {
      tags: ["Users"],

      summary: "Update current user",

      requestBody: jsonRequest(
        "#/components/schemas/UpdateUserRequest",

        updateUserExample,
      ),

      responses: {
        200: okResponse(
          "Updated user.",

          "#/components/schemas/User",
        ),
      },
    },
  },
};
