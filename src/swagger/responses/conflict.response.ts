export const conflictResponse = {

    description:
        "Conflict.",

    content: {

        "application/json": {

            schema: {

                $ref:
                    "#/components/schemas/ErrorResponse",

            },

        },

    },

};