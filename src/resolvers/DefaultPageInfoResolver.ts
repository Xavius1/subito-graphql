import { AnyObject } from '..';
import GID from '../helpers/GID.js';

/** @public */
type CursorProps = {
  startCursor?: string
  endCursor?: string
} & AnyObject;

/**
 * Create a generic page info resolver
 *
 * @param type - The entity type
 * @returns
 *
 * @public
 */
const DefaultPageInfoResolver = (type: string) => ({
  /**
   * Resolve the startCursor field
   *
   * @param obj - The object to resolve
   * @returns
   *
   * @public
   */
  startCursor({ startCursor }: CursorProps) {
    if (startCursor) {
      return GID.encode(
        type,
        startCursor,
      );
    }

    return null;
  },

  /**
   * Resolve the endCursor field
   * @param obj - The object to resolve
   * @returns
   *
   * @public
   */
  endCursor({ endCursor }: CursorProps) {
    if (endCursor) {
      return GID.encode(
        type,
        endCursor,
      );
    }

    return null;
  },
});

export default DefaultPageInfoResolver;
