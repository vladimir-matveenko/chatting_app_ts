export const ChatSchema = {

    Chat: {

        type: "object",

        properties: {

            id: {

                type: "string",

                format: "uuid",

            },

            type: {

                type: "string",

            },

            title: {

                type: "string",

                nullable: true,

            },

            avatarUrl: {

                type: "string",

                nullable: true,

            },

            ownerId: {

                type: "string",

                format: "uuid",

            },

            createdAt: {

                type: "string",

                format: "date-time",

            },

            updatedAt: {

                type: "string",

                format: "date-time",

            },

        },

    },

};