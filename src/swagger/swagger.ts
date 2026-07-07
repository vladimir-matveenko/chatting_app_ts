import swaggerJSDoc
    from "swagger-jsdoc";

import { paths }
    from "./paths.js";

import { schemas }
    from "./schemas.js";

import { tags }
    from "./tags.js";


import {
    securitySchemes,
} from "./security/index.js";

export const swaggerSpec =
    swaggerJSDoc({

        definition: {

            openapi: "3.0.3",

            info: {

                title:
                    "Chatting App API",

                version:
                    "1.0.0",

                description:
                    "REST API for Chatting App",

            },

            servers: [

                {

                    url:
                        "http://localhost:3000",

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