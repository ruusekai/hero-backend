import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthManager } from './auth.manager';
import { AuthRegistrationVerifySmsResendReqDto } from './dto/request/auth.registration.verify.sms.resend.req.dto';
import { AuthRegistrationVerifySmsValidateReqDto } from './dto/request/auth.registration.verify.sms.validate.req.dto';
import { AuthRegistrationByBasicAuthReqDto } from './dto/request/auth.registration.by.basic.auth.req.dto';
import { UserAuthType } from '../../database/mysql/entities/user.entity';
import { RequiredHeader } from '../../common/decorator/required.header.decorator';
import { Public } from '../../common/decorator/public.endpoint.decorator';
import { AuthLoginByOauthGoogleReqDto } from './dto/request/auth.login.by.oauth.google.req.dto';
import { AuthLoginByOauthFacebookReqDto } from './dto/request/auth.login.by.oauth.facebook.req.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authManager: AuthManager,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Public()
  @Post('/registration/verify-sms/resend')
  async registrationVerifySmsResend(
    @Body() request: AuthRegistrationVerifySmsResendReqDto,
  ) {
    return this.authManager.registrationVerifySmsResend(request.mobile);
  }

  //wont deactivate the token, just for FE to show checking result
  @Public()
  @Post('/registration/verify-sms/validate')
  async registrationVerifySmsValidate(
    @Body() request: AuthRegistrationVerifySmsValidateReqDto,
  ) {
    return this.authManager.registrationVerifySmsValidate(
      request.mobile,
      request.token,
    );
  }

  @Public()
  @Post('/registration')
  async register(
    @Body() request: AuthRegistrationByBasicAuthReqDto,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.registerByBasicAuth(
      request.mobile,
      request.password,
      request.token,
      request.email,
      clientIp,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginByBasicAuth(
    @Request() req,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.loginByBasicAuth(req.user, clientIp);
  }

  @Public()
  @Get('/oauth/:authType')
  getOauthLoginNonce(@Param('authType') authType: UserAuthType) {
    return this.authManager.getOauthLoginNonce(authType);
  }

  @Public()
  @Post('/oauth/login/google')
  loginByOauthGoogle(
    @Body() request: AuthLoginByOauthGoogleReqDto,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.loginByOauthGoogle(request.idToken, clientIp);
  }

  @Public()
  @Post('/oauth/login/facebook')
  loginByOauthFacebook(
    @Body() request: AuthLoginByOauthFacebookReqDto,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.loginByOauthFacebook(request.accessToken, clientIp);
  }

  @Public()
  @Get('testing/:authType/:nonce')
  testing(
    @Param('authType') authType: UserAuthType,
    @Param('nonce') nonce: string,
  ) {
    // return this.userOauthLoginNonceRepository.deactivateOneNonceByAuthTypeAndNonce(
    //   authType,
    //   nonce,
    // );
  }
}
