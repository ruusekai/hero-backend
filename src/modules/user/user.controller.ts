import { Body, Controller, Request, Post, Get, Logger } from '@nestjs/common';
import { UserManager } from './user.manager';
import { UserCreateKycApplicationReqDto } from './dto/request/user.create.kyc.application.req.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userManager: UserManager) {}
  private readonly logger = new Logger(UserController.name);

  @Post('/kyc')
  async createKycApplication(@Body() request: UserCreateKycApplicationReqDto) {
    return await this.userManager.createKycApplication(
      request.user_uuid,
      request.image,
    );
  }

  @Get('/info')
  getProfile(@Request() req) {
    this.logger.log(JSON.stringify(req.user));
    return this.userManager.getUserInfoByUuid(req.user.uuid);
  }
}
