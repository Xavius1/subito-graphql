import { AnyObject } from '..';
import GID from '../helpers/GID.js';
import mutationPayload from '../payloads/mutationPayload.js';

export type CreateProps = {
  input: AnyObject
}

export type UpdateInput = {
  id: string
  values: AnyObject
}

export type UpdateProps = {
  input: UpdateInput
}

export type DeleteInput = {
  id: string
}

export type DeleteProps = {
  input: DeleteInput
}

const DefaultMutationResolver = (source: string) => ({
  async create({ input }: CreateProps, context: AnyObject) {
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].create({ input });

    return mutationPayload(
      Abac[source].read({
        doc: await dataSources[`${source}s`].createDoc(input, context),
      }),
    );
  },

  async update({ input }: UpdateProps, context: AnyObject) {
    const { id, values } = input;
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].update({ input });

    return mutationPayload(
      Abac[source].read({
        doc: await dataSources[`${source}s`].updateDoc({
          id: GID.decode(id, true),
          values,
        }, context),
      }),
    );
  },

  async delete({ input }: DeleteProps, context: AnyObject) {
    const { id } = input;
    const { dataSources } = context;
    const { Abac } = dataSources;

    Abac[source].update({ input });

    const { doc } = await dataSources[`${source}s`].delete({
      id: GID.decode(id, true),
    }, context);

    return mutationPayload(
      Abac[source].read({ doc }),
    );
  },
});

export default DefaultMutationResolver;
