import { Body, Controller, Request, Post, Get, Logger } from '@nestjs/common';
import { UserManager } from './user.manager';
import { UserCreateKycApplicationReqDto } from './dto/request/user.create.kyc.application.req.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userManager: UserManager) {}
  private readonly logger = new Logger(UserController.name);

  @Post('/kyc')
  async createKycApplication(
    @Request() req,
    @Body() request: UserCreateKycApplicationReqDto,
  ) {
    return await this.userManager.createKycApplication(
      req.user.uuid,
      request.fullName,
      request.fileUuid,
      request.kycIdNumber,
    );
  }

  @Get('/kyc')
  async getLatestKycRecord(@Request() req) {
    return await this.userManager.getLatestKycRecord(req.user.uuid);
  }

  @Get('/info')
  getProfile(@Request() req) {
    this.logger.log(JSON.stringify(req.user));
    return this.userManager.getUserInfoByUuid(req.user.uuid);
  }
}
