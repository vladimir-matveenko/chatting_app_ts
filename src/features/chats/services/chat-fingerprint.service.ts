import crypto from "node:crypto";

import { ChatType } from "../enums/chat-type.enum.js";

import type { CreateChatDto } from "../dto/create-chat.dto.js";

export class ChatFingerprintService {
  build(dto: CreateChatDto): string {
    const members = [...dto.memberIds].sort();

    if (dto.type === ChatType.PRIVATE) {
      return crypto

        .createHash("sha256")

        .update(`private:${members.join(":")}`)

        .digest("hex");
    }

    return crypto

      .createHash("sha256")

      .update(
        ["group", dto.ownerId, dto.title ?? "", dto.avatarUrl ?? "", members.join(",")].join("|"),
      )

      .digest("hex");
  }
}
