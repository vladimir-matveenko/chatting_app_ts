import { errorSchemas } from "./error.schema.js";
import { idSchema } from "./id.schema.js";

export const commonSchemas = {
  ...errorSchemas,

  ...idSchema,
};
