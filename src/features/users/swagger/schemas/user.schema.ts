export const User = {

    type: "object",

    properties: {

        id: {

            type: "integer",

            example: 1,

        },

        username: {

            type: "string",

            example: "john",

        },

        displayName: {

            type: "string",

            nullable: true,

            example: "John Smith",

        },

        email: {

            type: "string",

            format: "email",

            example: "john@example.com",

        },

        avatarUrl: {

            type: "string",

            nullable: true,

            example:
                "https://example.com/avatar.png",

        },

        createdAt: {

            type: "string",

            format: "date-time",

            example:
                "2026-07-07T10:00:00.000Z",

        },

    },

};