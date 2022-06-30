/**
 * Abstract class to implements Abac control
 * Initialize as data sources to have context
 *
 * @example
 * ```
 * class MyAbac extends Abac {
 *   protected policies = [ EntityPolicy ];
 * }
 * ```
 * Then into index.ts
 * ```
 * dataSources: () => ({
 *   abac: new MyAbac()
 * })
 * ```
 * To use it:
 * ```
 * const { dataSources: { Abac } } = context;
 * Abac.EntityPolicy.create(input);
 * Abac.EntityPolicy.delete(input);
 * Abac.EntityPolicy.read(doc);
 * Abac.EntityPolicy.update(input);
 * ```
 *
 * @public
 */
abstract class Abac {
  protected context = null;

  protected policies = [];

  public initialize({
    // @ts-ignore TODO need to be handle
    context,
  } = {}) {
    this.context = context;
    const { policies } = this;
    Object.keys(policies).forEach((policy: string) => {
      // @ts-ignore TODO need to be handle
      this[policy] = new policies[policy](context);
    });
  }
}

export default Abac;
