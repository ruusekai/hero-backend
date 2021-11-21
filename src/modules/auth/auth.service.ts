import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // private jwtService: JwtServic
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneUserByUsername(username);
    this.logger.log('user: %s', JSON.stringify(user));
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
