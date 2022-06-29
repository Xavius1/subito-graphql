import { AnyObject } from '..';
import GID from '../helpers/GID';

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

const DefaultQueryResolver = (source: string) => ({
  async getOne({ id, type = 'ID' }: GetOneProps, context: AnyObject) {
    const { dataSources } = context;

    if (type === 'ID' || !type) {
      return dataSources[source].getOneById(
        GID.decode(id, true),
      );
    }

    return dataSources[source].getOneByFields({ [type.toLowerCase()]: id });
  },

  async getMany(args: AnyObject, context: AnyObject) {
    const { dataSources } = context;

    return dataSources[source].getByCursor(
      resolveCursors(args),
    );
  },

  async getAll(args: AnyObject, context: AnyObject) {
    const { dataSources } = context;

    return dataSources[source].getAll(args);
  },
});

export default DefaultQueryResolver;
