import type {
    QueryResult,
    QueryResultRow,
} from "pg";

import { Database } from "../database/database.js";
import type { Mapper } from "../mappers/mapper.js";

export abstract class BaseRepository<
    TEntity extends QueryResultRow,
    TModel,
> {
    constructor(
        protected readonly db: Database,
        protected readonly mapper: Mapper<
            TEntity,
            TModel
        >,
    ) { }

    protected map(
        entity: TEntity,
    ): TModel {
        return this.mapper.map(entity);
    }

    protected mapNullable(
        entity: TEntity | null,
    ): TModel | null {
        return entity
            ? this.mapper.map(entity)
            : null;
    }

    protected mapMany(
        entities: TEntity[],
    ): TModel[] {
        return entities.map(
            (entity) => this.mapper.map(entity),
        );
    }

    protected getOne(
        result: QueryResult<TEntity>,
    ): TEntity | null {
        return result.rows[0] ?? null;
    }

    protected getOneOrNull(
        result: QueryResult<TEntity>,
    ): TEntity | null {
        return result.rows[0] ?? null;
    }
}