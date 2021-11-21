import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { UserManager } from './user.manager';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userManager: UserManager,
  ) {}

  // @Post('/register')
  // async createRegistration (@Body() request: UserRegisterReqDto){
  //     return await this.userManager.createRegistration(request.username, request.password);
  // }
}
