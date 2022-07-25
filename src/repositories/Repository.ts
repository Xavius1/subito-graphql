import { DataSource } from 'apollo-datasource';
import type { Context } from 'subito-lib';
/**
 * Abstract class repository
 *
 * @remarks
 * Use this abstract class when you create a new repository
 * TODO: Handle cache
 *
 * @public
 */
abstract class Repository extends DataSource<Context> {
  protected context: Context | undefined;

  initialize({
    context,
  }: { [key: string]: any} = {}) {
    this.context = context;
  }
}

export default Repository;
