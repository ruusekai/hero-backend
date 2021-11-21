import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { User } from '../../database/mysql/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findOneUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findByUsername(username);
  }
}
