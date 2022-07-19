import { AnyObject } from '..';
import GID from '../helpers/GID.js';

type CursorProps = {
  startCursor?: string
  endCursor?: string
} & AnyObject;

const DefaultPageInfoResolver = (type: string) => ({
  startCursor({ startCursor }: CursorProps) {
    if (startCursor) {
      return GID.encode(
        type,
        startCursor,
      );
    }

    return null;
  },
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
