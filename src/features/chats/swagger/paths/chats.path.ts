export const ChatsPaths = {

    "/chats": {

        get: {

            tags: [

                "Chats",

            ],

            summary:

                "Get user chats",

            description:

                "Returns all chats of the authenticated user.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            responses: {

                200: {

                    description:

                        "User chats.",

                    content: {

                        "application/json": {

                            schema: {

                                type: "array",

                                items: {

                                    $ref: "#/components/schemas/ChatListItem",

                                },

                            },

                        },

                    },

                },

                401: {

                    description:

                        "Unauthorized.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/ErrorResponse",

                            },

                        },

                    },

                },

            },

        },

        post: {

            tags: [

                "Chats",

            ],

            summary:

                "Create chat",

            description:

                "Creates a new private or group chat.",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref: "#/components/schemas/CreateChatRequest",

                        },

                    },

                },

            },

            responses: {

                201: {

                    description:

                        "Chat created successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/ChatDetails",

                            },

                        },

                    },

                },

                400: {

                    description:

                        "Validation error.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/ErrorResponse",

                            },

                        },

                    },

                },

                401: {

                    description:

                        "Unauthorized.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/ErrorResponse",

                            },

                        },

                    },

                },

                409: {

                    description:

                        "Chat already exists.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/ErrorResponse",

                            },

                        },

                    },

                },

            },

        },

    },

};