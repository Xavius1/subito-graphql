import get from 'get-value';
import type { IPaginator, PaginatorOrder } from './ArrayPaginator.js';

export interface IDocument {
  [key: string]: any
}
interface IMapper {
  [key: string]: any
  get: Function
}

interface IEntity {
  [key: string]: any
  Mapper: IMapper
  get: Function
}

class ArrayRepository {
  private collection: IDocument[] = [];

  protected Mapper: any;

  load(docs: IDocument[], extension = {}) {
    this.collection = docs.map((doc) => this.entity({ ...doc, ...extension }));

    return this;
  }

  entity(doc: IDocument) {
    const entity: IEntity = {
      ...doc,
      Mapper: this.Mapper,
      get(field: string) {
        return get(this, this.Mapper.get(field), { default: this[field] });
      },
    };

    entity.get.bind(entity);

    return entity;
  }

  paginate(paginator: IPaginator) {
    const {
      field, value, order, limit,
    } = paginator.config();
    const sorted = this.sort({ field, order });
    const docs = this.filter({
      docs: [...sorted], field, value, order,
    });
    let currentDocs = [...docs];
    if (limit) {
      currentDocs = docs.slice(0, limit);
    }

    paginator.setPageInfo({
      total: sorted.length,
      cursored: docs.length,
    });

    return currentDocs;
  }

  insertMany(docs: IDocument[]) {
    this.collection = [...this.collection, ...docs];
    // this.sort();
    return this;
  }

  insertOne(doc: IDocument) {
    this.collection.push(doc);
    // this.sort();
    return this;
  }

  filter({ // eslint-disable-line class-methods-use-this
    docs, field, value, order = 'ASC',
  }: { docs: IDocument[], field: string, value: any, order?: PaginatorOrder}) {
    if (!value) {
      return docs;
    }

    if (order === 'DESC') {
      return docs.filter((doc: IDocument) => doc.get(field) < value);
    }
    return docs.filter((doc: IDocument) => doc.get(field) > value);
  }

  sort({ field, order = 'ASC' }: { field: string, order?: PaginatorOrder }) {
    const { collection } = this;
    if (order === 'DESC') {
      return collection.sort((a, b) => b.get(field) - a.get(field));
    }
    return collection.sort((a, b) => a.get(field) - b.get(field));
  }
}

export default ArrayRepository;
