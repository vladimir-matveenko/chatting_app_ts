import { jsonResponse } from "../../../../swagger/builders/index.js";
import { healthResponseExample } from "../examples/health.response.example.js";

export const getHealthPath = {
  "/health": {
    get: {
      tags: ["Health"],

      summary: "Get server status",

      responses: {
        200: jsonResponse("Server status", "", healthResponseExample),
      },
    },
  },
};
