import { AnyObject } from '..';
import GID from '../helpers/GID';

type InfoProps = {
  parentType: string
} & AnyObject;

const DefaultEntityResolver = {
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
