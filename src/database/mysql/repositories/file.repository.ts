import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { File } from '../entities/file.entity';

@EntityRepository(File)
@Injectable()
export class FileRepository extends Repository<File> {
  constructor() {
    super();
  }

  async findOneFileByUuidAndIsDeletedFalse(uuid: string): Promise<File> {
    try {
      return await this.findOne({ uuid: uuid, isDeleted: false });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveFile(File: File): Promise<File> {
    try {
      File.updatedDate = new Date(Date.now());
      return await this.save(File);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}
