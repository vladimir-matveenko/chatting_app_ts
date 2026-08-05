import { CreateMessageRequestValidator } from "./create-message-request.validator.js";
import { GetMessagesRequestValidator } from "./get-messages-request.validator.js";
import { UpdateMessageRequestValidator } from "./update-message-request.validator.js";

export class MessagesRequestValidators {
  constructor(
    public readonly create: CreateMessageRequestValidator,
    public readonly update: UpdateMessageRequestValidator,
    public readonly getMessages: GetMessagesRequestValidator,
  ) {}
}
