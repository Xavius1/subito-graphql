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
  protected viewer = null;

  protected gateway = null;

  constructor({ viewer, gateway }) {
    this.viewer = viewer;
    this.gateway = gateway;
  }

  protected hasRole(role) {
    const { roles = [] } = this.viewer;
    return roles.include(role);
  }

  public read({ doc }) {
    return doc;
  }

  public create() {
    return true;
  }

  public delete() {
    return true;
  }

  public update() {
    return true;
  }
}

export default Policy;
