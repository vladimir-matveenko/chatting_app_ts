import type {
    QueryResult,
    QueryResultRow,
} from "pg";

import { Database } from "./database.js";
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
            entity => this.mapper.map(entity),
        );
    }

    protected getOneOrNull(
        result: QueryResult<TEntity>,
    ): TEntity | null {
        return result.rows[0] ?? null;
    }

    protected async queryOne(
        sql: string,
        params: readonly unknown[] = [],
    ): Promise<TEntity | null> {

        const result =
            await this.db.query<TEntity>(
                sql,
                params,
            );

        return this.getOneOrNull(result);

    }

    protected async queryMany(
        sql: string,
        params: readonly unknown[] = [],
    ): Promise<TEntity[]> {

        const result =
            await this.db.query<TEntity>(
                sql,
                params,
            );

        return result.rows;

    }

    protected async findOne(
        sql: string,
        params: readonly unknown[] = [],
    ): Promise<TModel | null> {

        const entity =
            await this.queryOne(
                sql,
                params,
            );

        return this.mapNullable(entity);

    }

    protected async findMany(
        sql: string,
        params: readonly unknown[] = [],
    ): Promise<TModel[]> {

        const entities =
            await this.queryMany(
                sql,
                params,
            );

        return this.mapMany(entities);

    }
}