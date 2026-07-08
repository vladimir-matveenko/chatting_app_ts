export const errorSchemas = {

    ErrorResponse: {

        type: "object",

        properties: {

            status: {

                type: "integer",

                example: 401,

            },

            code: {

                type: "string",

                example: "UNAUTHORIZED",

            },

            message: {

                type: "string",

                example: "Unauthorized.",

            },

        },

    },

};