import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export class PaginateRspDto {
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
