export const CreateChatRequestSchema = {

    CreateChatRequest: {

        type: "object",

        required: [

            "type",

            "memberIds",

        ],

        properties: {

            type: {

                type: "string",

                enum: [

                    "PRIVATE",

                    "GROUP",

                ],

            },

            title: {

                type: "string",

                nullable: true,

            },

            avatarUrl: {

                type: "string",

                format: "uri",

                nullable: true,

            },

            memberIds: {

                type: "array",

                items: {

                    type: "string",

                    format: "uuid",

                },

            },

        },

    },

};