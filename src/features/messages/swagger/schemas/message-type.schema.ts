export const MessageTypeSchema = {
  MessageType: {
    type: "string",

    enum: ["text", "image", "video", "audio", "file", "system"],
  },
};
