import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  async findByUsername(username: string): Promise<User> {
    try {
      return await this.findOne({ username: username });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      // throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}
