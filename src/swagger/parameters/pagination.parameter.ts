export const pageParameter = {
  name: "page",

  in: "query",

  required: false,

  schema: {
    type: "integer",

    default: 1,
  },
};

export const limitParameter = {
  name: "limit",

  in: "query",

  required: false,

  schema: {
    type: "integer",

    default: 20,
  },
};
