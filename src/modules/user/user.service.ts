import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { User } from '../../database/mysql/entities/user.entity';
import { UserKyc } from '../../database/mysql/entities/user.kyc.entity';
import { UserKycRepository } from '../../database/mysql/repositories/user.kyc.repository';
import { UserProfile } from '../../database/mysql/entities/user.profile.entity';
import { UserProfileRepository } from '../../database/mysql/repositories/user.profile.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userKycRepository: UserKycRepository,
    private readonly userProfileRepository: UserProfileRepository,
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

  async updateUserProfile(user: User, icon: string, selfIntroduction: string) {
    const existingUserProfile: UserProfile =
      await this.findUserProfileByUserUuid(user.uuid);
    const userProfile: UserProfile = existingUserProfile ?? new UserProfile();
    userProfile.userUuid = user.uuid;
    userProfile.icon = icon ?? userProfile.icon;
    userProfile.selfIntroduction =
      selfIntroduction ?? userProfile.selfIntroduction;
    return await this.saveUserProfile(userProfile);
  }

  async findUserProfileByUserUuid(userUuid: string): Promise<UserProfile> {
    return this.userProfileRepository.findOneUserProfileByUserUuid(userUuid);
  }

  async saveUserProfile(userProfile): Promise<UserProfile> {
    return this.userProfileRepository.saveUserProfile(userProfile);
  }
}
