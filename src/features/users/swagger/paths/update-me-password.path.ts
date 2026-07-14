import { jsonRequest, noContentResponse } from "../../../../swagger/builders/index.js";

import { updatePasswordExample } from "../examples/index.js";

export const updateMePasswordPath = {
  "/users/me/password": {
    patch: {
      tags: ["Users"],

      summary: "Change password",

      requestBody: jsonRequest(
        "#/components/schemas/UpdatePasswordRequest",

        updatePasswordExample,
      ),

      responses: {
        204: noContentResponse("Password updated."),
      },
    },
  },
};
