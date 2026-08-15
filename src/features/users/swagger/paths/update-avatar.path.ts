import { okResponse } from "../../../../swagger/builders/index.js";

export const updateAvatarPath = {
  "/users/me/avatar": {
    post: {
      tags: ["Users"],

      summary: "Upload current user avatar",

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UploadAvatarRequest",
            },
          },
        },
      },

      responses: {
        200: okResponse("Avatar uploaded.", "#/components/schemas/User"),
      },
    },
    delete: {
      tags: ["Users"],

      summary: "Delete current user avatar",

      responses: {
        204: {
          description: "Avatar deleted.",
        },
      },
    },
  },
};
