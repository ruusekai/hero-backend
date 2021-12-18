import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { User } from '../../database/mysql/entities/user.entity';
import { UserKyc } from '../../database/mysql/entities/user.kyc.entity';
import { UserKycRepository } from '../../database/mysql/repositories/user.kyc.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userKycRepository: UserKycRepository,
  ) {}

  //user-repo
  async findOneUserByUuid(uuid: string): Promise<User> {
    return await this.userRepository.findOneUserByOptionsAndIsDeletedFalse({
      uuid: uuid,
    });
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOneUserKycByUserUuidOrderByUpdatedDateDesc(
    userUuid: string,
  ): Promise<UserKyc> {
    return await this.userKycRepository.findOneUserKycByUserUuidAndIsDeletedFalseOrderByUpdatedDateDesc(
      userUuid,
    );
  }

  async saveUserKyc(userKyc: UserKyc): Promise<UserKyc> {
    return await this.userKycRepository.saveUserKyc(userKyc);
  }
}
