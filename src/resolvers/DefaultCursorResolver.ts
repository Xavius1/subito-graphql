import GID from '../helpers/GID.js';
import type { AnyObject } from '..';

export type CursorProps = {
  cursor: string
} & AnyObject

const DefaultCursorResolver = (type: string) => ({
  cursor({ cursor }: CursorProps) {
    return GID.encode(
      type,
      cursor,
    );
  },
});

export default DefaultCursorResolver;
