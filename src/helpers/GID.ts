import {
  Cryptor,
  Checker,
} from 'subito-lib';
import type { EncryptData } from 'subito-lib';
import e from '../security/env.js';

const checker = new Checker(true);

/**
 * Class use to transform local ID to base 64 globally unique ID
 * Specs by relayjs
 * @public
 */
class GID {
  /**
   * Generate a globally unique id
   *
   * @example
   * We want to build a GID to identify the third product save in cart
   * Each cart are saved into a document containing an array of product
   * ```
   * // Prints "12":
   * console.log(GID.encode('Cart', 'aEDl54dscc45', { product: 2 }));
   * ```
   *
   * @param type - Type of the entity (User, Article, ...)
   * @param id - ID from the local source (table, collection, ...)
   * @param data - Any specific data to identify the doc source (like an array index)
   * @returns A globally unique id
   */
  static encode(type: string, id: string | number, data?: Object | string | number): string {
    checker.isExists(type);
    checker.isExists(id);
    let str = `${type}/${id}/2.2`;
    if (data) {
      const cryptor = new Cryptor(e.GID_DATA_CRYPTO_KEY);
      const crypted = cryptor.encrypt(JSON.stringify(data));
      str = `${str}/${JSON.stringify(crypted)}`;
    }
    return Buffer
      .from(str, 'binary')
      .toString('base64');
  }

  /**
   * Decode a global ID
   *
   * @example
   * We want to build a GID to identify the third product save in cart
   * Each cart are saved into a document containing an array of product
   * ```
   * // Prints "12":
   * console.log(GID.decode('xxx'));
   * ```
   *
   * @param gid - GID to decode
   * @param options - Options to use, use forceInt = true if your local id must be an int
   * @returns
   */
  static decode(gid: string, raw?: Boolean) {
    checker.isExists(gid);
    const [type, id, version, data] = Buffer
      .from(gid, 'base64')
      .toString('binary')
      .split('/');

    const parsedId: string | number = JSON.parse(id);
    const parsedVersion = parseFloat(version);

    let parsedData = {};
    if (data) {
      const tmpData: EncryptData = JSON.parse(data);
      const crypto = new Cryptor(e.GID_DATA_CRYPTO_KEY, tmpData.api);
      parsedData = JSON.parse(crypto.decrypt(tmpData.data));
    }

    if (raw) {
      return parsedId;
    }

    return {
      id: parsedId,
      version: parsedVersion,
      data: parsedData,
      type,
    };
  }

  /**
   * Decode an array of global ID's
   *
   * @param gid - array of GID's
   * @param options - Same as {@link GID.decode}
   * @returns
   */
  static batchDecode(ids: string[], raw?: Boolean) {
    checker.isArray(ids);
    return ids.map((id) => GID.decode(id, raw));
  }
}

export default GID;
