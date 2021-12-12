import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  async findOneUserByOptionsAndIsDeletedFalse(options: any): Promise<User> {
    try {
      options.isDeleted = false;
      return await this.findOne(options);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUser(user: User): Promise<User> {
    try {
      user.updatedDate = new Date(Date.now());
      return await this.save(user);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}
