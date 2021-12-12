import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserManager } from './user.manager';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { UserCreateKycApplicationReqDto } from './dto/request/user.create.kyc.application.req.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/user')
export class UserController {
  constructor(private readonly userManager: UserManager) {}

  @Post('/kyc')
  async createKycApplication(@Body() request: UserCreateKycApplicationReqDto) {
    return await this.userManager.createKycApplication(
      request.user_uuid,
      request.image,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  getProfile(@Request() req) {
    return this.userManager.getUserInfoByUuid(req.user.uuid);
  }
}
