import { jsonRequest, jsonResponse } from "../../../../swagger/builders/index.js";
import { badRequestResponse, internalServerResponse, unauthorizedResponse } from "../../../../swagger/responses/index.js";
import { authResponseExample, loginRequestExample } from "../auth/index.js";

export const loginPath = {

    "/auth/login": {

        post: {

            tags: [

                "Auth",

            ],

            security: [],

            summary:
                "Login",

            requestBody:

                jsonRequest(

                    "#/components/schemas/LoginRequest",

                    loginRequestExample,

                ),

            responses: {

                "200":

                    jsonResponse(

                        "Authenticated.",

                        "#/components/schemas/AuthResponse",

                        authResponseExample,

                    ),

                "401":
                    unauthorizedResponse,

            },

        },

    },

};