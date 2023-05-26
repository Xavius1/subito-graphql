import { Thrower } from 'subito-lib';
import { AnyObject } from '..';
import e from '../security/env.js';
import httpCode, { HttpCode } from '../helpers/httpCode.js';
import payloader from '../payloads/payloader.js';

/** @public */
export type ReadManyByCursorInput = {
  edges: {cursor: string, node: AnyObject | null}[]
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    totalPage: number
    totalResults: number
    currentPage: number
    startCursor: string
    endCursor: string
  } | null
}

/** @public */
export type ReadManyByCursorOptions = {
  keepIfNull?: boolean
}

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
  /**
   * The current viewer
   *
   * @public
   */
  protected viewer: AnyObject | null = null;

  /**
   * The proxy
   *
   * @public
   */
  protected proxy: AnyObject | null = null;

  /**
   * The current gateway
   *
   * @public
   */
  protected gateway = null;

  /**
   * The current context
   *
   * @public
   */
  protected context: unknown;

  // @ts-ignore TODO handle it
  constructor(context) {
    this.context = context;
    const { viewer, gateway, app } = context;
    this.viewer = viewer;
    this.gateway = gateway;
    this.proxy = app;
  }

  /**
   * To call when policy cant auth the action
   *
   * @param dontThrow - Return false instead of throw an error
   * @returns
   *
   * @throws {@link Thrower.forbidden}
   * Thrown when dontThrow = false or when it's not define
   *
   * @public
   */
  cant(dontThrow = false): false { // eslint-disable-line class-methods-use-this
    if (dontThrow) {
      Thrower.forbidden();
    }
    return false;
  }

  /**
   * Send a forbidden payload
   * @returns
   *
   * @public
   */
  forbidden() { // eslint-disable-line class-methods-use-this
    return payloader({ code: httpCode.FORBIDDEN });
  }

  /**
   * Send an unauthorized payload
   * @returns
   *
   * @public
   */
  unauthorized() { // eslint-disable-line class-methods-use-this
    return payloader({ code: httpCode.UNAUTHORIZED });
  }

  /**
   * Send a bad request payload
   * @returns
   *
   * @public
   */
  badRequest() { // eslint-disable-line class-methods-use-this
    return payloader({ code: httpCode.BAD_REQUEST });
  }

  /**
   * Send a payload with an empty node
   * @param code - An HTTP code
   * @returns
   *
   * @public
   */
  stop(code: HttpCode) { // eslint-disable-line class-methods-use-this
    return payloader({ code });
  }

  /**
   * Is the call done by a proxy ?
   *
   * @param id - To check a specific proxy
   * @returns
   *
   * @public
   */
  protected isProxy(id?: string) {
    if (!this.proxy) {
      return false;
    }

    const { id: proxyId } = this.proxy;
    if (id && proxyId !== id) {
      return false;
    }

    return true;
  }

  /**
   * Check if the current user has a role
   *
   * @param role - The role to check
   * @returns
   *
   * @public
   */
  protected hasRole(role: string): boolean {
    if (!this.isAuth()) {
      return false;
    }

    const { roles = [] } = <AnyObject>(this.viewer);
    return roles.includes(role);
  }

  /**
   * Check if the user is an admin
   *
   * @remarks
   * Shotcut to hasRole() method
   *
   * @returns
   *
   * @public
   */
  protected isAdmin() {
    return this.hasRole(e.ROLE_ADMIN);
  }

  /**
   * Check if the user is auth
   *
   * @returns
   *
   * @public
   */
  protected isAuth() {
    return !!(this.viewer);
  }

  /**
   * Check if the user is a guest
   *
   * @returns
   *
   * @public
   */
  protected isGuest() {
    return (!this.isProxy() && !this.isAuth());
  }

  /**
   * Check if the user is a specific viewer
   *
   * @returns
   *
   * @public
   */
  protected isViewer(id: string) {
    return (this.isAuth() && this.viewer?.id === id);
  }

  /**
   * Read a doc
   *
   * @param doc - the doc to read
   * @returns
   *
   * @public
   */
  public read(doc: AnyObject | null) {
    if (this.isAdmin()) {
      return doc;
    }

    return null;
  }

  /**
   * Read a list of doc listed by cursor
   * @param docs - The list of docs
   * @returns
   *
   * @public
   */
  public readManyByCursor(
    docs: ReadManyByCursorInput,
    { keepIfNull }: ReadManyByCursorOptions = {},
  ) {
    const items = { ...docs };
    docs.edges.forEach((edge, index) => {
      const doc = edge.node ? this.read(edge.node) : null;
      if (doc || keepIfNull) {
        items.edges[index].node = edge.node ? this.read(edge.node) : null;
      } else {
        items.edges.splice(index, 1);
      }
    });
    items.pageInfo = <ReadManyByCursorInput['pageInfo'] | null>(this.read(docs.pageInfo));

    return items;
  }

  /**
   * Read an array of docs
   *
   * @param docs - The docs to read
   * @param keepNull - If you want to keep a null entry if the doc is not allowed
   * @returns
   *
   * @public
   */
  public readMany(docs: AnyObject[], keepNull?: true) {
    const items: (AnyObject | null)[] = [];
    docs.forEach((doc) => {
      const item = this.read(doc);
      if (item || keepNull) {
        items.push(item);
      }
    });

    return items;
  }

  /**
   * Check if a doc can be create, then throw if not
   * @returns
   *
   * @public
   */
  public create() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }

  /**
   * Check if a doc can be deleted, then throw if not
   * @returns
   *
   * @public
   */
  public delete() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }

  /**
   * Check if a doc can be updated, then throw if not
   * @returns
   *
   * @public
   */
  public update() {
    if (!this.isAdmin()) {
      Thrower.forbidden();
    }

    return true;
  }
}

export default Policy;
