import swaggerJSDoc from "swagger-jsdoc";

import { paths } from "./paths.js";

import { schemas } from "./schemas.js";

import { tags } from "./tags.js";

import { securitySchemes } from "./security/index.js";

import { env } from "../core/config/env.js";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",

    info: {
      title: `${env.appName} API`,

      version: env.appVersion,

      description: "REST API for Chatting App",
    },

    servers: [
      {
        url: env.apiUrl,
      },
    ],

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags,

    components: {
      schemas,
      securitySchemes,
    },

    paths,
  },

  apis: [],
});
