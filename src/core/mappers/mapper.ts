export interface Mapper<TEntity, TModel> {
    toModel(entity: TEntity): TModel;
}