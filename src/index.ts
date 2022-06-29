/**
 * Library for subito micro services using GraphQL interface
 *
 * @packageDocumentation
 */

// Helpers
export { default as GID } from './helpers/GID';

// Payloads
export { default as failPayload } from './payloads/failPayload';
export { default as successPayload } from './payloads/successPayload';
export { default as mutationPayload } from './payloads/mutationPayload';

// Resolvers
export { default as DefaultCursorResolver } from './resolvers/DefaultCursorResolver';
export { default as DefaultEntityResolver } from './resolvers/DefaultEntityResolver';
export { default as DefaultMutationResolver } from './resolvers/DefaultMutationResolver';
export { default as DefaultPageInfoResolver } from './resolvers/DefaultPageInfoResolver';
export { default as DefaultQueryResolver } from './resolvers/DefaultQueryResolver';
export { graphqlScalarsResolvers as DefaultScalarsResolver } from './resolvers/DefaultScalarsResolver';

export type AnyObject = {
  [key: string]: any
  __proto__: never
}
