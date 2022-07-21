import { Thrower } from 'subito-lib';
import { AnyObject } from '..';
import e from '../security/env.js';

/**
 * Abstract class to implements Abac policy control
 *
 * @example
 * ```
 * class EntityPolicy extends Policy {
 *   read({ doc }) {
 *     if(this.hasRole['ADMIN']) {
 *       return doc;
 *     }
 *     return null;
 *   }
 * }
 * ```
 * Then into a resolver
 * ```
 * const { dataSources: { Abac } } = context;
 * Abac.EntityPolicy.read({ doc });
 * ```
 *
 * @public
 */
abstract class Policy {
  protected viewer: AnyObject | null = null;

  protected gateway = null;

  // @ts-ignore TODO handle it
  constructor({ viewer, gateway }) {
    this.viewer = viewer;
    this.gateway = gateway;
  }

  protected hasRole(role: string) {
    if (!this.viewer) {
      return false;
    }

    const { roles = [] } = this.viewer;
    return roles.include(role);
  }

  protected isAdmin() {
    return this.hasRole(e.ROLE_ADMIN);
  }

  public read(doc: AnyObject) {
    if (this.isAdmin()) {
      return doc;
    }

    return null;
  }

  public readMany(docs: AnyObject[]) {
    return docs.map((doc) => this.read({ doc }));
  }

  public create() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }

  public delete() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }

  public update() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }
}

export default Policy;
