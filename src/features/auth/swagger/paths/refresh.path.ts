export const refreshPath = {

    "/auth/refresh": {

        post: {

            tags: [

                "Auth",

            ],

            security: [],

            summary:
                "Refresh tokens",

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            type: "object",

                            required: [

                                "refreshToken",

                            ],

                            properties: {

                                refreshToken: {

                                    type: "string",

                                },

                            },

                        },

                    },

                },

            },

            responses: {

                "200": {

                    description:
                        "Tokens refreshed.",

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