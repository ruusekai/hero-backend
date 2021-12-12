import { IsNotEmpty } from 'class-validator';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

export class PaginateResponse {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  constructor(iMeta: IPaginationMeta) {
    this.itemCount = iMeta.itemCount;
    this.totalItems = iMeta.totalItems;
    this.itemsPerPage = iMeta.itemsPerPage;
    this.totalPages = iMeta.totalPages;
    this.currentPage = iMeta.currentPage;
  }
}

export class AppResponsePaginate<T> {
  @IsNotEmpty()
  items: T[];

  paginate: PaginateResponse;

  constructor(iItems: T[] | Pagination<T>, iPaginate?: PaginateResponse) {
    if (iItems instanceof Pagination) {
      this.items = iItems.items;
      this.paginate = new PaginateResponse(iItems.meta);
    } else {
      this.items = iItems;
      this.paginate = iPaginate;
    }
  }
}
