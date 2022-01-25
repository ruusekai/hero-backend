import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { User } from '../../database/mysql/entities/user.entity';
import { UserKyc } from '../../database/mysql/entities/user.kyc.entity';
import { UserKycRepository } from '../../database/mysql/repositories/user.kyc.repository';
import { UserProfile } from '../../database/mysql/entities/user.profile.entity';
import { UserProfileRepository } from '../../database/mysql/repositories/user.profile.repository';
import { UserCoupon } from '../../database/mysql/entities/user.coupon.entity';
import { UserCouponRepository } from '../../database/mysql/repositories/user.coupon.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userKycRepository: UserKycRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userCouponRepository: UserCouponRepository,
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
    return await this.userProfileRepository.findOneUserProfileByUserUuid(
      userUuid,
    );
  }

  async saveUserProfile(userProfile): Promise<UserProfile> {
    return await this.userProfileRepository.saveUserProfile(userProfile);
  }

  async findUserCouponByOptions(options: any): Promise<UserCoupon[]> {
    return await this.userCouponRepository.findUserCouponByOptionsOrderByStatusAscAndUpdatedDateDesc(
      options,
    );
  }

  async findActiveUserCoupon(
    userUuid: string,
    userCouponUuid: string,
  ): Promise<UserCoupon> {
    return await this.userCouponRepository.findActiveUserCouponByUserUuidAndUserCouponUuid(
      userUuid,
      userCouponUuid,
    );
  }

  async saveUserCoupon(userCoupon: UserCoupon): Promise<UserCoupon> {
    return await this.userCouponRepository.saveUserCoupon(userCoupon);
  }
}
