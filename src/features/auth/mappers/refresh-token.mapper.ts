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

            id: entity.id,

            userId: entity.user_id,

            tokenHash:
                entity.token_hash,

            expiresAt:
                entity.expires_at,

            createdAt:
                entity.created_at,

            revokedAt:
                entity.revoked_at,

        };

    }

}