import { AnyObject } from '..';
import GID from '../helpers/GID';
import mutationPayload from '../payloads/mutationPayload';

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

    return mutationPayload(
      await dataSources[source].createDoc(input, context),
    );
  },

  async update({ input: { id, values } }: UpdateProps, context: AnyObject) {
    const { dataSources } = context;

    return mutationPayload(
      await dataSources[source].updateDoc({
        id: GID.decode(id, true),
        values,
      }, context),
    );
  },

  async delete({ input: { id } }: DeleteProps, context: AnyObject) {
    const { dataSources } = context;
    const { doc } = await dataSources[source].delete({
      id: GID.decode(id, true),
    }, context);

    return mutationPayload(
      doc,
    );
  },
});

export default DefaultMutationResolver;
