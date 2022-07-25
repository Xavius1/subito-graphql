import GID from '../helpers/GID.js';
import type { AnyObject } from '..';

/** @public */
export type CursorProps = {
  cursor: string
} & AnyObject

/**
 * Create a generic cursor resolver
 * @param type - The entity type
 * @returns
 *
 * @public
 */
const DefaultCursorResolver = (type: string) => ({
  /**
   * Resolve the cursor field
   *
   * @param obj - The object to resolve
   * @returns
   *
   * @public
   */
  cursor({ cursor }: CursorProps) {
    return GID.encode(
      type,
      cursor,
    );
  },
});

export default DefaultCursorResolver;
