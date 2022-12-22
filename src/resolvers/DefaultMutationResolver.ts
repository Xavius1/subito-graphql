import { AnyObject } from '..';
import GID from '../helpers/GID.js';
import payload from '../payloads/payload.js';
import plural from './helpers/plural.js';

/** @public */
export type CreateProps = {
  input: AnyObject
}

/** @public */
export type UpdateInput = {
  id: string
  values: AnyObject
}

/** @public */
export type UpdateProps = {
  input: UpdateInput
}

/** @public */
export type DeleteInput = {
  id: string
}

/** @public */
export type DeleteProps = {
  input: DeleteInput
}

/**
 * Create a generic mutation resolver
 *
 * @param source - The name of the data source
 * @returns
 *
 * @public
 */
const DefaultMutationResolver = (source: string) => ({
  /**
   * Create a new doc
   *
   * @param input - The doc to save
   * @param context - The current context
   * @returns
   *
   * @public
   */
  async create({ input }: CreateProps, context: AnyObject) {
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].create({ input });

    return payload({
      data: Abac[source].read(
        await dataSources[plural(source)].createDoc(input, context),
      ),
    });
  },

  /**
   * Update a doc
   *
   * @param input - The data to update
   * @param context - The current context
   * @returns
   *
   * @public
   */
  async update({ input }: UpdateProps, context: AnyObject) {
    const { id, values } = input;
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].update({ input });

    return payload({
      data: Abac[source].read(
        await dataSources[plural(source)].updateDoc({
          id: GID.decode(id, true),
          query: { $set: { ...values } },
        }, context),
      ),
    });
  },

  /**
   * Delete an existing doc
   *
   * @param input - The input to identify the doc to delete
   * @param context - The current context
   * @returns
   *
   * @public
   */
  async delete({ input }: DeleteProps, context: AnyObject) {
    const { id } = input;
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].update({ input });

    const { doc } = await dataSources[plural(source)].deleteById(
      GID.read(id),
    );

    return payload({
      data: Abac[source].read(doc),
    });
  },
});

export default DefaultMutationResolver;
