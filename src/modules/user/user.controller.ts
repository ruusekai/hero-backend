import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserManager } from './user.manager';
import { UserCreateKycApplicationReqDto } from './dto/request/user.create.kyc.application.req.dto';
import { UserPatchUserReqDto } from './dto/request/user.patch.user.req.dto';
import { UserCouponStatus } from './enum/user.coupon.status';
import { UserCreateBankApplicationReqDto } from './dto/request/user.create.bank.application.req.dto';

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
      request.kycIdFileUuid,
      request.selfieFileUuid,
      request.kycIdNumber,
    );
  }

  @Get('/kyc')
  async getLatestKycRecord(@Request() req) {
    return await this.userManager.getLatestKycRecord(req.user.uuid);
  }

  @Get('/info')
  getInfo(@Request() req) {
    this.logger.log(JSON.stringify(req.user));
    return this.userManager.getUserInfoByUuid(req.user.uuid);
  }

  @Patch('')
  async patchUser(@Request() req, @Body() request: UserPatchUserReqDto) {
    return this.userManager.patchUser(req.user.uuid, request);
  }

  @Get('/profile')
  getSelfProfile(@Request() req) {
    return this.userManager.getProfileByUserUuid(req.user.uuid);
  }

  @Get('/profile/:userUuid')
  getProfile(@Request() req, @Param('userUuid') userUuid: string) {
    return this.userManager.getProfileByUserUuid(userUuid);
  }

  @Get('/coupon')
  findAllUserCouponByUserUuid(@Request() req) {
    return this.userManager.findAllUserCouponByUserUuidAndStatus(req.user.uuid);
  }

  @Get('/coupon/:status')
  findUserCouponByUserUuidAndStatus(
    @Request() req,
    @Param('status')
    status: UserCouponStatus,
  ) {
    return this.userManager.findAllUserCouponByUserUuidAndStatus(
      req.user.uuid,
      status,
    );
  }

  @Post('/bank')
  async createBankApplication(
    @Request() req,
    @Body() request: UserCreateBankApplicationReqDto,
  ) {
    return await this.userManager.createBankApplication(
      req.user.uuid,
      request.fullName,
      request.bankingCardFileUuid,
      request.bankCode,
      request.bankNumber,
    );
  }

  @Get('/bank')
  async getLatestBankRecord(@Request() req) {
    return await this.userManager.getLatestBankRecord(req.user.uuid);
  }
}
