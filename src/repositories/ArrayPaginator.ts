import { Calculator, Data, Datte } from 'subito-lib';
import type { ParseType } from 'subito-lib';
import moment from 'moment';
import type { IDocument } from './ArrayRepository';

export type PaginatorArgs = {
  first: number
  last: number
  before: string
  after: string
}

export interface IPaginator {
  config: Function
  setPageInfo: Function
}

type CursorEdge = {
  cursor: string
  node: any
}

export type PaginatorOrder = 'ASC' | 'DESC';

/**
 * Class to implements the cursor paginator pattern
 * Specs by relayjs
 *
 * @param args - Configure the paginator
 *
 * @public
 */
class Paginator implements IPaginator {
  private order: PaginatorOrder;

  private limit: number = 0;

  private field: string = 'createdAt';

  private type: ParseType | 'Date' = 'Date';

  private value: string | null = null;

  private hasNextPage: boolean = false;

  private hasPreviousPage: boolean = false;

  private currentPage: number = 0;

  private totalPage: number = 0;

  private totalResults: number = 0;

  constructor({
    first,
    last,
    before,
    after,
  }: PaginatorArgs) {
    this.limit = first || last;
    this.order = first ? 'ASC' : 'DESC';
    this.value = first ? after : before;
  }

  setCursor({ field, type }: { field: string, type: ParseType | 'Date'}) {
    this.field = field;
    this.type = type;
    return this;
  }

  config() {
    const {
      limit, order, field, value: defaultValue, type,
    } = this;
    let data = null;
    let value = null;
    if (type === 'Date') {
      data = new Datte({ date: <string>defaultValue });
      value = data.toString();
    } else {
      data = new Data(defaultValue);
      value = defaultValue ? data.parseType(type) : null;
    }

    return {
      limit,
      order,
      field,
      value,
    };
  }

  setPageInfo({ total = 0, cursored = 0 }) {
    const { limit, order } = this;
    const previousResults = (total - cursored);
    this.totalResults = total;
    this.hasNextPage = (cursored - limit > 0);
    this.hasPreviousPage = (previousResults > 0);
    this.totalPage = (total > 0) ? Math.ceil(total / limit) : 0;
    this.currentPage = 1;
    if (previousResults) {
      this.currentPage = Calculator.round(Math.ceil(previousResults / this.limit) + 1);
    }
    if (order === 'DESC') {
      this.currentPage = Calculator.round(this.totalPage - this.currentPage + 1);
    }
  }

  getDocCursor(doc: IDocument) {
    const { type, field } = this;
    const value = doc.get(field);
    if (type === 'Date') {
      return moment(value).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }

    return value;
  }

  map(docs: IDocument[]) {
    const {
      hasNextPage, hasPreviousPage, totalPage, totalResults, currentPage,
    } = this;
    const edges: CursorEdge[] = [];
    docs.forEach((doc) => {
      edges.push({
        cursor: this.getDocCursor(doc),
        node: doc,
      });
    });
    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        totalPage,
        totalResults,
        currentPage,
        startCursor: (docs.length !== 0 ? this.getDocCursor(docs[0]) : null),
        endCursor: (docs.length !== 0 ? this.getDocCursor(docs[(docs.length - 1)]) : null),
      },
    };
  }
}

export default Paginator;
