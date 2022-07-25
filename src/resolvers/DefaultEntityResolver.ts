import { AnyObject } from '..';
import GID from '../helpers/GID.js';

/** @public */
type InfoProps = {
  parentType: string
} & AnyObject;

/**
 * Create a generic entity resolver
 * @public
 */
const DefaultEntityResolver = {
  /**
   * Resolve the ID field
   * @param obj - The object to resolve
   * @param _args - Unused
   * @param _context - Unused
   * @param info - The request info
   * @returns
   *
   * @public
   */
  id(obj: AnyObject | null, _args: any, _context: any, { parentType }: InfoProps) {
    if (!obj) {
      return null;
    }

    return GID.encode(
      parentType,
      obj.id,
    );
  },
};

export default DefaultEntityResolver;
