import { AnyObject } from '..';
import GID from '../helpers/GID.js';
import mutationPayload from '../payloads/mutationPayload.js';
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

    return mutationPayload(
      Abac[source].read(
        await dataSources[plural(source)].createDoc(input, context),
      ),
    );
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

    return mutationPayload(
      Abac[source].read(
        await dataSources[plural(source)].updateDoc({
          id: GID.decode(id, true),
          values,
        }, context),
      ),
    );
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

    const { doc } = await dataSources[plural(source)].delete({
      id: GID.decode(id, true),
    }, context);

    return mutationPayload(
      Abac[source].read(doc),
    );
  },
});

export default DefaultMutationResolver;
