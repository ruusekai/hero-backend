import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
