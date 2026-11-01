import {
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PageInput } from './page.input';
import { PagePaginationMetaOutput } from './page-pagination-meta.output';

const MAX_PAGE_LIMIT = 100;

interface FindPageQuery<Entity extends ObjectLiteral> {
  where: FindOptionsWhere<Entity>;
  order: FindOptionsOrder<Entity>;
}

interface FoundPage<Entity> {
  items: Entity[];
  meta: PagePaginationMetaOutput;
}

export const findPage = async <Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  input: PageInput,
  query: FindPageQuery<Entity>,
): Promise<FoundPage<Entity>> => {
  const page = Math.max(1, input.page);
  const limit = Math.min(Math.max(1, input.limit), MAX_PAGE_LIMIT);
  const skip = (page - 1) * limit;

  const [items, total] = await repository.findAndCount({
    ...query,
    skip,
    take: limit,
  });

  return {
    items,
    meta: {
      page,
      total,
      hasNextItems: skip + items.length < total,
      hasPrevItems: page > 1,
    },
  };
};
