/**
 * Abstract class to implements Abac control
 * Initialize as data sources to have context
 *
 * @example
 * ```
 * class MyAbac extends Abac {
 *   public Entity: EntityAbac
 * }
 * ```
 * Then into index.ts
 * ```
 * dataSources: () => ({
 *   abac: new MyAbac()
 * })
 * ```
 *
 * @public
 */
abstract class Abac {
  protected context = null;

  initialize({
    // @ts-ignore TODO need to be handle
    context,
  } = {}) {
    this.context = context;
  }
}

export default Abac;
