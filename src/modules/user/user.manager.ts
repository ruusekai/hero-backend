import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../database/mysql/entities/user.entity';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { AppResponse } from '../../common/response/app.response';
import { UserInfoRspDto } from './dto/response/user.info.rsp.dto';
import { UserKyc } from '../../database/mysql/entities/user.kyc.entity';
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { UserKycRspDto } from './dto/response/user.kyc.rsp.dto';
import { UserPatchUserReqDto } from './dto/request/user.patch.user.req.dto';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../../database/mysql/entities/user.profile.entity';
import { UserProfileRspDto } from './dto/response/user.profile.rsp.dto';
import { UserCouponDto } from './dto/entity/user.coupon.dto';
import { Coupon } from '../../database/mysql/entities/coupon.entity';
import { FindAllUserCouponRspDto } from './dto/response/find.all.user.coupon.rsp.dto';
import { UserCouponStatus } from './enum/user.coupon.status';

@Injectable()
export class UserManager {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(UserManager.name);

  async createKycApplication(
    userUuid: string,
    fullName: string,
    kycIdFileUuid: string,
    selfieFileUuid: string,
    kycIdNumber: string,
  ): Promise<AppResponse> {
    //check if the user already done kyc
    const user: User = await this.userService.findOneUserByUuid(userUuid);
    if (user.isKyc === true) {
      throw new ApiException(ResponseCode.STATUS_4007_KYC_ALREADY_COMPLETED);
    }
    //check if the latest kyc application is PENDING/APPROVED, if so, throw error
    const latestUserKycRecord: UserKyc =
      await this.userService.findOneUserKycByUserUuidOrderByUpdatedDateDesc(
        userUuid,
      );
    if (
      latestUserKycRecord != null &&
      latestUserKycRecord.adminStatus !== AdminApprovalStatus.DECLINED
    ) {
      throw new ApiException(ResponseCode.STATUS_4007_KYC_ALREADY_COMPLETED);
    }
    //if no existing record, allow it to create kyc application
    let newUserKyc: UserKyc = new UserKyc(
      userUuid,
      kycIdFileUuid,
      selfieFileUuid,
      fullName,
      kycIdNumber,
      AdminApprovalStatus.PENDING,
    );
    newUserKyc = await this.userService.saveUserKyc(newUserKyc);
    const rsp: UserKycRspDto = new UserKycRspDto(newUserKyc);
    return new AppResponse(rsp);
  }

  async getLatestKycRecord(useruuid: string): Promise<AppResponse> {
    const userKyc: UserKyc =
      await this.userService.findOneUserKycByUserUuidOrderByUpdatedDateDesc(
        useruuid,
      );
    const rsp: UserKycRspDto = new UserKycRspDto(userKyc);
    return new AppResponse(rsp);
  }

  async getUserInfoByUuid(uuid: string): Promise<AppResponse> {
    const user: User = await this.userService.findOneUserByUuid(uuid);
    if (user == null) {
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }
    const rsp: UserInfoRspDto = new UserInfoRspDto(user);
    return new AppResponse(rsp);
  }

  async patchUser(userUuid: string, request: UserPatchUserReqDto) {
    const user: User = await this.userService.findOneUserByUuid(userUuid);
    if (user == null) {
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }

    //change mobile, related to auth module
    if (request.newMobile != null) {
      if (request.token == null) {
        throw new ApiException(ResponseCode.STATUS_4004_BAD_REQUEST);
      }
      await this.authService.changeMobile(
        user,
        request.newMobile,
        request.token,
      );
    }
    if (request.email != null) {
      await this.authService.changeEmail(user, request.email);
    }
    await this.userService.updateUserProfile(
      user,
      request.icon,
      request.selfIntroduction,
    );
    return new AppResponse();
  }

  async getProfileByUserUuid(userUuid: string): Promise<AppResponse> {
    const user: User = await this.userService.findOneUserByUuid(userUuid);
    if (user == null) {
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }
    const userProfile: UserProfile =
      await this.userService.findUserProfileByUserUuid(userUuid);
    const userProfileRspDto: UserProfileRspDto = new UserProfileRspDto(
      user.uuid,
      user.isBoss,
      user.isHero,
      user.isKyc,
      userProfile ? userProfile.icon : null,
      userProfile ? userProfile.selfIntroduction : null,
    );
    return new AppResponse(userProfileRspDto);
  }

  async findAllUserCouponByUserUuidAndStatus(
    userUuid: string,
    status: UserCouponStatus = null,
  ) {
    const options: any = {};
    options.userUuid = userUuid;
    if (status != null) {
      options.status = status;
    }

    const userCouponList = await this.userService.findUserCouponByOptions(
      options,
    );
    const userCouponDtoList: UserCouponDto[] = userCouponList.map(
      (userCouponEntity) => {
        const couponEntity: Coupon = userCouponEntity.coupon;
        return new UserCouponDto(
          userCouponEntity.uuid,
          couponEntity.type,
          couponEntity.code,
          userCouponEntity.status,
          userCouponEntity.expiryDate,
          couponEntity.name,
          couponEntity.description,
          couponEntity.discountValue,
        );
      },
    );
    const rsp = new FindAllUserCouponRspDto(userCouponDtoList);
    return new AppResponse(rsp);
  }
}
