import { jsonResponse } from "./response.builder.js";

export function okResponse(
  description: string,

  schema: string,
) {
  return jsonResponse(
    description,

    schema,
  );
}
