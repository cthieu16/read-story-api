import {
  CollectionDto,
  CounterDto,
  FilterableParameters,
  SortableParameters,
} from 'src/_dtos/input.dto';
import { CollectionResponse, Pagination } from 'src/_dtos/output.dto';

export type QueryExecutor<T> = {
  exec(): Promise<T>;
  skip(offset: number): QueryExecutor<T>;
  limit(limit: number): QueryExecutor<T>;
  sort(data: SortableParameters): QueryExecutor<T>;
};

export type Model = {
  countDocuments(query: FilterableParameters): QueryExecutor<number>;
  find<T>(query: FilterableParameters): QueryExecutor<T[]>;
};

export class DocumentCollector<T> {
  constructor(private model: Model) {}

  async find(query: CollectionDto): Promise<CollectionResponse<T>> {
    const q = this.model
      .find(query.filter)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit);

    if (query.sorter) {
      const sortOptions: SortableParameters =
        '_id' in query.sorter ? query.sorter : { ...query.sorter, _id: 'asc' };
      q.sort(sortOptions);
    } else {
      q.sort({ createdAt: 'desc' });
    }

    const data = (await q.exec()) as T[];
    return {
      data,
      pagination: await this.paginate(query),
    };
  }

  private async paginate(query: CollectionDto): Promise<Pagination> {
    const count: number = await this.count(query);
    const totalPages = Math.ceil(count / query.limit);

    const pagination: Pagination = {
      total: count,
      page: query.page,
      limit: query.limit,
      totalPages: totalPages,
      next:
        (query.page + 1) * query.limit >= count ? undefined : query.page + 1,
      prev: query.page == 0 ? undefined : query.page - 1,
    };

    return pagination;
  }

  async count(query: CounterDto): Promise<number> {
    return this.model.countDocuments(query.filter).exec();
  }
}
