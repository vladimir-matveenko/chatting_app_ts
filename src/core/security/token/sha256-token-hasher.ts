import crypto from "node:crypto";

import type { TokenHasher } from "./token-hasher.js";

export class Sha256TokenHasher implements TokenHasher {
  hash(token: string): string {
    return crypto

      .createHash("sha256")

      .update(token)

      .digest("hex");
  }
}
