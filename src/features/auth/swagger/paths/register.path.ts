export const registerPath = {

    "/auth/register": {

        post: {

            tags: [

                "Auth",

            ],

            security: [],

            summary:
                "Register",

            description:
                "Create new user.",

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref:
                                "#/components/schemas/RegisterRequest",

                        },

                    },

                },

            },

            responses: {

                "201": {

                    description:
                        "User created.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:
                                    "#/components/schemas/AuthResponse",

                            },

                        },

                    },

                },

            },

        },

    },

};