export const ChatTypeSchema = {
  ChatType: {
    type: "string",

    enum: ["private", "group"],
  },
};
