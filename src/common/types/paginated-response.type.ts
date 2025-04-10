export type PaginatedResponseType<T> = {
  items: T[];
  itemsTotal: number;
  page: number;
  pageSize: number;
};
