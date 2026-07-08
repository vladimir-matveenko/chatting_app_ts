export const RegisterRequest = {

    type: "object",

    required: [

        "username",

        "email",

        "password",

    ],

    properties: {

        username: {

            type: "string",

            example: "john",

        },

        email: {

            type: "string",

            format: "email",

            example: "john@example.com",

        },

        password: {

            type: "string",

            example: "Password123!",

        },

    },

};