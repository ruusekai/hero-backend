import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { FileThumbnail } from '../entities/file.thumbnail.entity';

@EntityRepository(FileThumbnail)
@Injectable()
export class FileThumbnailRepository extends Repository<FileThumbnail> {
  constructor() {
    super();
  }

  async findOneFileThumbnailByFileUuidAndIsDeletedFalse(
    fileUuid: string,
  ): Promise<FileThumbnail> {
    try {
      return await this.findOne({ fileUuid: fileUuid, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveFileThumbnail(
    FileThumbnail: FileThumbnail,
  ): Promise<FileThumbnail> {
    try {
      FileThumbnail.updatedDate = new Date(Date.now());
      return await this.save(FileThumbnail);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}
