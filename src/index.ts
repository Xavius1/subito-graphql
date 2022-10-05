/**
 * Library for subito micro services using GraphQL interface
 *
 * @packageDocumentation
 */

// Abac
export { default as Abac } from './abac/Abac.js';
export { default as Policy } from './abac/Policy.js';
export { default as Entity } from './abac/Entity.js';

// Helpers
export { default as GID } from './helpers/GID.js';
export { default as message } from './helpers/message.js';
export type { Code, Message } from './helpers/message.js';

// Payloads
export { default as payload } from './payloads/payload.js';
export type { PayloadInput, PayloadResponse } from './payloads/payload.js';
export { default as failPayload } from './payloads/failPayload.js';
export { default as successPayload } from './payloads/successPayload.js';
export { default as mutationPayload } from './payloads/mutationPayload.js';

// Resolvers
export { default as DefaultCursorResolver } from './resolvers/DefaultCursorResolver.js';
export { default as DefaultEntityResolver } from './resolvers/DefaultEntityResolver.js';
export { default as DefaultMutationResolver } from './resolvers/DefaultMutationResolver.js';
export { default as DefaultPageInfoResolver } from './resolvers/DefaultPageInfoResolver.js';
export { default as DefaultQueryResolver } from './resolvers/DefaultQueryResolver.js';
export { graphqlScalarsResolvers as DefaultScalarsResolver } from './resolvers/DefaultScalarsResolver.js';

// Repositories
export { default as Repository } from './repositories/Repository.js';

/** @public */
export type AnyObject = {
  [key: string]: any
}
/** @public */
export type { DocumentNode } from 'graphql';
