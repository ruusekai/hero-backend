import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserManager {
  constructor(
    private readonly userService: UserService,
  ) {}
}
