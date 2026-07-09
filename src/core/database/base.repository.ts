import type { PoolClient, QueryResult, QueryResultRow } from "pg";

import { Database } from "./database.js";
import type { Mapper } from "../mappers/mapper.js";
import { InternalServerError } from "../errors/index.js";

export abstract class BaseRepository<TEntity extends QueryResultRow, TModel> {
  constructor(
    protected readonly db: Database,
    protected readonly mapper: Mapper<TEntity, TModel>,
  ) {}

  protected map(entity: TEntity): TModel {
    return this.mapper.map(entity);
  }

  protected mapNullable(entity: TEntity | null): TModel | null {
    return entity ? this.mapper.map(entity) : null;
  }

  protected mapMany(entities: TEntity[]): TModel[] {
    return entities.map((entity) => this.mapper.map(entity));
  }

  protected getOneOrNull(result: QueryResult<TEntity>): TEntity | null {
    return result.rows[0] ?? null;
  }

  protected async queryOne(sql: string, params: readonly unknown[] = []): Promise<TEntity | null> {
    const result = await this.db.query<TEntity>(sql, params);

    return this.getOneOrNull(result);
  }

  protected async queryMany(sql: string, params: readonly unknown[] = []): Promise<TEntity[]> {
    const result = await this.db.query<TEntity>(sql, params);

    return result.rows;
  }

  protected async findOne(sql: string, params: readonly unknown[] = []): Promise<TModel | null> {
    const entity = await this.queryOne(sql, params);

    return this.mapNullable(entity);
  }

  protected async findMany(sql: string, params: readonly unknown[] = []): Promise<TModel[]> {
    const entities = await this.queryMany(sql, params);

    return this.mapMany(entities);
  }

  protected async saveOne(sql: string, params: readonly unknown[] = []): Promise<TModel> {
    const entity = await this.queryOne(sql, params);

    if (!entity) {
      throw new InternalServerError(
        "Database operation returned no rows.",
        "DATABASE_OPERATION_FAILED",
      );
    }

    return this.map(entity);
  }

  protected async queryOneTx(
    client: PoolClient,

    sql: string,

    params: readonly unknown[] = [],
  ): Promise<TEntity | null> {
    const result = await client.query<TEntity>(
      sql,

      [...params],
    );

    return this.getOneOrNull(result);
  }

  protected async queryManyTx(
    client: PoolClient,

    sql: string,

    params: readonly unknown[] = [],
  ): Promise<TEntity[]> {
    const result = await client.query<TEntity>(
      sql,

      [...params],
    );

    return result.rows;
  }

  protected async saveOneTx(
    client: PoolClient,

    sql: string,

    params: readonly unknown[] = [],
  ): Promise<TModel> {
    const entity = await this.queryOneTx(
      client,

      sql,

      params,
    );

    if (!entity) {
      throw new InternalServerError(
        "Database operation returned no rows.",

        "DATABASE_OPERATION_FAILED",
      );
    }

    return this.map(entity);
  }
}
