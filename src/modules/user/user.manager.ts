import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../database/mysql/entities/user.entity';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { AppResponse } from '../../common/response/app.response';
import { UserInfoRspDto } from '../auth/dto/response/user.info.rsp.dto';
import { UserKyc } from '../../database/mysql/entities/user.kyc.entity';
import { AdminApprovalStatus } from '../../common/enum/admin.approval.status';
import { UserKycRspDto } from './dto/response/user.kyc.rsp.dto';

@Injectable()
export class UserManager {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserManager.name);

  async createKycApplication(
    userUuid: string,
    fullName: string,
    fileUuid: string,
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
      fileUuid,
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
}
