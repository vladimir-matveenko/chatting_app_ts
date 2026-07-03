import type {
    QueryResult,
    QueryResultRow,
} from "pg";

import type { Database } from "../config/database.js";

import type { Mapper } from "../mappers/mapper.js";
import { AppError } from "../errors/index.js";

export abstract class BaseRepository<
    TEntity extends QueryResultRow,
    TModel,
> {

    constructor(
        protected readonly db: Database,
        protected readonly mapper: Mapper<TEntity, TModel>,
    ) { }

    protected map(entity: TEntity): TModel {
        return this.mapper.toModel(entity);
    }

    protected mapNullable(
        entity: TEntity | null,
    ): TModel | null {

        return entity
            ? this.mapper.toModel(entity)
            : null;

    }

    protected mapMany(
        entities: TEntity[],
    ): TModel[] {

        return entities.map(
            (entity) => this.mapper.toModel(entity),
        );

    }

    protected requireOne(
        entity: TEntity | null,
        error: AppError,
    ): TEntity {

        if (!entity) {
            throw error;
        }

        return entity;
    }

    protected getOneOrNull(
        result: QueryResult<TEntity>,
    ): TEntity | null {

        return result.rows[0] ?? null;

    }

}