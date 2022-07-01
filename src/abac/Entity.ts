import { AnyObject } from '..';

export type Map = {
  [key: string]: string
}

/**
 * Class to generate a entity before returning data
 *
 * You can re-map some fields, like _id to id
 * And keep the only fields authorized by the ABAC policy
 *
 * @example
 * ```
 * // Define which fields to remap
 * const map = {_id: 'id'};
 * // Create your entity
 * const user = new Entity(doc, map);
 * // Filter data
 * entity.keep(['id', 'firstname']);
 * // Or you can also filter data with the remove method
 * entity.remove(['email','mobile']);
 * // Then get the values
 * entity.get();
 * ```
 *
 * @public
 */
class Entity {
  private data: AnyObject = {};

  constructor(doc: AnyObject, map: Map = {}) {
    const mappedDoc = { ...doc };
    Object.keys(map).forEach((origin: string) => {
      mappedDoc[map[origin]] = doc[origin];
      delete mappedDoc[origin];
    });
    this.data = mappedDoc;
  }

  /**
   * Define which fields to keep in the entity
   *
   * @param fields - An array of string matching the fields to keep
   * @returns
   *
   * @public
   */
  keep(fields: string[]) {
    const filteredDoc: AnyObject = {};
    fields.forEach((field) => {
      filteredDoc[field] = this.data[field];
    });
    this.data = filteredDoc;

    return this;
  }

  /**
   * Define which fields to remove in the entity
   *
   * @param fields - An array of string matching the fields to remove
   * @returns
   */
  remove(fields: string[]) {
    const filteredDoc = { ...this.data };
    fields.forEach((field) => {
      delete filteredDoc[field];
    });
    this.data = filteredDoc;

    return this;
  }

  /**
   * Get the mapped & filtered data
   *
   * @returns
   */
  get() {
    return this.data;
  }
}

export default Entity;
