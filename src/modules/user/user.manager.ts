import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../database/mysql/entities/user.entity';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { AppResponse } from '../../common/response/app.response';
import { UserInfoRspDto } from '../auth/dto/response/user.info.rsp.dto';

@Injectable()
export class UserManager {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserManager.name);

  async createKycApplication(userUuid: string, image: string) {
    //check if the user already done kyc
    const user: User = await this.userService.findOneUserByUuid(userUuid);
    if (user.isKyc === true) {
      throw new ApiException(ResponseCode.STATUS_4007_KYC_ALREADY_COMPLETED);
    }
    //if no existing record, allow it to create kyc application
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
