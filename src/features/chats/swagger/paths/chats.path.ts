import {

    badRequestResponse,

    conflictResponse,

    notFoundResponse,

    unauthorizedResponse,

} from "../../../../swagger/responses/index.js";

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

                401: unauthorizedResponse,

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

                                $ref: "#/components/schemas/Chat",

                            },

                        },

                    },

                },

                400: badRequestResponse,

                401: unauthorizedResponse,

                409: conflictResponse,

            },

        },

    },

    "/chats/{id}/members": {

        get: {

            tags: [

                "Chats",

            ],

            summary:

                "Get chat members",

            security: [

                {

                    bearerAuth: [],

                },

            ],

            parameters: [

                {

                    name: "id",

                    in: "path",

                    required: true,

                    schema: {

                        type: "string",

                    },

                },

            ],

            responses: {

                201: {

                    description:

                        "Chat created successfully.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref: "#/components/schemas/Chat",

                            },

                        },

                    },

                },

                400: badRequestResponse,

                401: unauthorizedResponse,

                404: notFoundResponse,

                409: conflictResponse,

            },
        },

    },

};