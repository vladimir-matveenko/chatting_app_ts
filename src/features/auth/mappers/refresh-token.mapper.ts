import type { Mapper }
    from "../../../core/mappers/mapper.js";

import type { RefreshTokenEntity }
    from "../entities/refresh-token.entity.js";

import type { RefreshToken }
    from "../models/refresh-token.model.js";

export class RefreshTokenMapper
    implements Mapper<
        RefreshTokenEntity,
        RefreshToken
    > {

    map(
        entity: RefreshTokenEntity,
    ): RefreshToken {

        return {

            userId: entity.user_id,

            tokenHash:
                entity.token_hash,

            expiresAt:
                entity.expires_at,

            createdAt:
                entity.created_at,

            updatedAt: entity.updated_at,

        };

    }

}