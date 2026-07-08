export const forbiddenResponse = {

    description:
        "Forbidden.",

    content: {

        "application/json": {

            schema: {

                $ref:
                    "#/components/schemas/ErrorResponse",

            },

        },

    },

};