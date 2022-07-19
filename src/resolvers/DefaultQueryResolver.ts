import { AnyObject } from '..';
import GID from '../helpers/GID.js';

/**
 * @internal
 */
const decode = (args: AnyObject, field: string) => {
  if (args?.[field]) {
    const id = GID.decode(args[field], true);
    return { [field]: id };
  }

  return { [field]: null };
};

/**
 * @internal
 */
const resolveCursors = (args: AnyObject) => ({
  ...args,
  ...decode(args, 'after'),
  ...decode(args, 'before'),
});

export type GetOneProps = {
  id: string
  type?: string
}

/**
 * Define default query resolvers
 *
 * Can be use as is or extended in a custom resolver
 *
 * @param source - The type of the entity to resolve
 * @returns
 *
 * @public
 */
const DefaultQueryResolver = (source: string) => ({
  /**
   * Get one entity
   *
   * @param args - Use to find the entity, "id" is mandatory, "type" optional
   * @param context - The request context
   * @returns
   *
   * @public
   */
  async getOne({ id, type = 'ID' }: GetOneProps, context: AnyObject) {
    const { dataSources } = context;
    const { Abac } = dataSources;

    if (type === 'ID' || !type) {
      return Abac[source].read(
        dataSources[`${source}s`].getOneById(
          GID.decode(id, true),
        ),
      );
    }

    return Abac[source].read(
      dataSources[`${source}s`].getOneByFields({ [type.toLowerCase()]: id }),
    );
  },

  /**
   * Get many entities with pagination (cursor or offset)
   * @param args - Args need to get results
   * @param context - The request context
   * @returns
   *
   * @public
   */
  async getMany(args: AnyObject, context: AnyObject) {
    const { dataSources } = context;
    const { Abac } = dataSources;

    return Abac[source].readManyByCursor(
      dataSources[`${source}s`].getByCursor(
        resolveCursors(args),
      ),
    );
  },

  /**
   * Get all matching entities in an array (without pagination)
   *
   * @param args - Args to match entities
   * @param context - The request context
   * @returns
   *
   * @public
   */
  async getAll(args: AnyObject, context: AnyObject) {
    const { dataSources } = context;
    const { Abac } = dataSources;

    return Abac[source].readMany(
      dataSources[`${source}s`].getAll(args),
    );
  },
});

export default DefaultQueryResolver;
