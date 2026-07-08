import {
    CreateChatRequestExample,
} from "../examples/index.js";

export const CreateChatPath = {

    "/chats": {

        post: {

            tags: [

                "Chats",

            ],

            security: [

                {

                    bearerAuth: [],

                },

            ],

            summary:

                "Create chat",

            requestBody: {

                required: true,

                content: {

                    "application/json": {

                        schema: {

                            $ref:

                                "#/components/schemas/CreateChatRequest",

                        },

                        examples: {

                            createChat:

                                CreateChatRequestExample,

                        },

                    },

                },

            },

            responses: {

                201: {

                    description:

                        "Chat created.",

                    content: {

                        "application/json": {

                            schema: {

                                $ref:

                                    "#/components/schemas/Chat",

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

                                $ref:

                                    "#/components/schemas/ErrorResponse",

                            },

                        },

                    },

                },

            },

        },

    },

};