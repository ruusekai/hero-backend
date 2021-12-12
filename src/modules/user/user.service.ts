import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { User } from '../../database/mysql/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //user-repo
  async findOneUserByUuid(uuid: string): Promise<User> {
    return await this.userRepository.findOneUserByOptionsAndIsDeletedFalse({
      uuid: uuid,
    });
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
