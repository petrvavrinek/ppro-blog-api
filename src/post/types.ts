import { ListOptions } from 'src/utils/list.options';

export type PostListOptions = {
  list?: ListOptions;
  finderId?: number;
};

export type PostListOrderOptions = PostListOptions & {
  order?: 'favourite';
};
