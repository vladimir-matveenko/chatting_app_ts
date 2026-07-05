import { BaseRepository }
    from "../../../core/database/base.repository.js";

import { Database }
    from "../../../core/database/database.js";

import {
    InternalServerError,
} from "../../../core/errors/index.js";

import type {
    IRefreshTokensRepository,
} from "../interfaces/refresh-tokens.repository.interface.js";

import { RefreshTokenMapper }
    from "../mappers/refresh-token.mapper.js";

import type {
    RefreshTokenEntity,
} from "../entities/refresh-token.entity.js";

import type {
    RefreshToken,
} from "../models/refresh-token.model.js";

import { RefreshTokensQueries }
    from "../queries/refresh-tokens.queries.js";

export class RefreshTokensRepository
    extends BaseRepository<
        RefreshTokenEntity,
        RefreshToken
    >
    implements IRefreshTokensRepository {

    constructor(
        db: Database,
        mapper: RefreshTokenMapper,
    ) {

        super(
            db,
            mapper,
        );

    }

    async create(
        userId: string,
        tokenHash: string,
        expiresAt: Date,
    ): Promise<RefreshToken> {

        return this.saveOne(

            RefreshTokensQueries.CREATE_REFRESH_TOKEN,

            [

                userId,

                tokenHash,

                expiresAt,

            ],

        );

    }

    async findByUserId(
        userId: string,
    ): Promise<RefreshToken | null> {

        return this.findOne(
            RefreshTokensQueries.FIND_REFRESH_TOKEN,
            [userId],
        );

    }

    async update(
        userId: string,
        tokenHash: string,
        expiresAt: Date,
    ): Promise<RefreshToken> {

        return this.saveOne(

            RefreshTokensQueries.UPDATE_REFRESH_TOKEN,

            [

                userId,

                tokenHash,

                expiresAt,

            ],

        );

    }

    async delete(
        userId: string,
    ): Promise<void> {

        await this.db.query(

            RefreshTokensQueries.DELETE_REFRESH_TOKEN,

            [userId],

        );

    }

}