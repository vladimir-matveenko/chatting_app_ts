export const GetChatsPath = {

    "/chats": {

        get: {

            tags: [

                "Chats",

            ],

            security: [

                {

                    bearerAuth: [],

                },

            ],

            summary:

                "Get user chats",

            responses: {

                200: {

                    description:

                        "User chats.",

                    content: {

                        "application/json": {

                            schema: {

                                type: "array",

                                items: {

                                    $ref:

                                        "#/components/schemas/Chat",

                                },

                            },

                        },

                    },

                },

            },

        },

    },

};