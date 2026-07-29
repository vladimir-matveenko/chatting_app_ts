import type { Mapper } from "../../../core/mappers/mapper.js";

import type { MessagesPageEntity } from "../entities/messages-page.entity.js";

import type { MessagesPage } from "../models/messages-page.model.js";
import { MessagesMapper } from "./messages.mapper.js";

export class MessagesPageMapper implements Mapper<MessagesPageEntity, MessagesPage> {
  constructor(private readonly messageMapper: MessagesMapper) {}

  map(entity: MessagesPageEntity): MessagesPage {
    return {
      messages: entity.messages.map((message) => this.messageMapper.map(message)),

      hasPrevious: entity.has_previous,

      hasNext: entity.has_next,
    };
  }
}
