export const ChatDetailsSchema = {

    ChatDetails: {

        type: "object",

        properties: {

            id: {

                type: "string",

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

                nullable: true,

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