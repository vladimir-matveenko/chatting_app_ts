export const badRequestResponse = {

    description:
        "Bad request.",

    content: {

        "application/json": {

            schema: {

                $ref:
                    "#/components/schemas/ErrorResponse",

            },

        },

    },

};