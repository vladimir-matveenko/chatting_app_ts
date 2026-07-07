export const UpdatePasswordRequest = {

    type: "object",

    required: [

        "currentPassword",

        "newPassword",

    ],

    properties: {

        currentPassword: {

            type: "string",

            example:
                "Password123!",

        },

        newPassword: {

            type: "string",

            example:
                "Password456!",

        },

    },

};