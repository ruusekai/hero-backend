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
import { AuthRegistrationByBasicAuthReqDto } from './dto/request/auth.registration.by.basic.auth.req.dto';
import { UserAuthType } from '../../database/mysql/entities/user.entity';
import { RequiredHeader } from '../../common/decorator/required.header.decorator';
import { Public } from '../../common/decorator/public.endpoint.decorator';
import { AuthLoginByOauthGoogleReqDto } from './dto/request/auth.login.by.oauth.google.req.dto';
import { AuthLoginByOauthFacebookReqDto } from './dto/request/auth.login.by.oauth.facebook.req.dto';
import { AuthForgetPasswordReqDto } from './dto/request/auth.forget.password.req.dto';
import { AuthResetPasswordReqDto } from './dto/request/auth.reset.password.req.dto';
import { AuthSmsTokenType } from './enum/auth.sms.token.type';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { AuthVerifySmsResendReqDto } from './dto/request/auth.verify.sms.resend.req.dto';
import { AuthVerifySmsValidateReqDto } from './dto/request/auth.verify.sms.validate.req.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authManager: AuthManager,
    private readonly authService: AuthService,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  @Public()
  @Post('/:smsTokenType/verify-sms/resend')
  async verifySmsResendWithoutLogin(
    @Param('smsTokenType') smsTokenType: AuthSmsTokenType,
    @Body() request: AuthVerifySmsResendReqDto,
  ) {
    if (smsTokenType === AuthSmsTokenType.REGISTRATION) {
      return this.authManager.registrationVerifySmsResend(request.mobile);
    } else if (smsTokenType === AuthSmsTokenType.FORGET_PASSWORD) {
      return this.authManager.forgetPasswordVerifySmsResend(request.mobile);
    } else if (smsTokenType === AuthSmsTokenType.CHANGE_MOBILE) {
      return this.authManager.changeMobileVerifySmsResend(request.mobile);
    } else {
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    }
  }

  //wont deactivate the token, just for FE to show checking result
  @Public()
  @Post('/:smsTokenType/verify-sms/validate')
  async registrationVerifySmsValidate(
    @Param('smsTokenType') smsTokenType: AuthSmsTokenType,
    @Body()
    request: AuthVerifySmsValidateReqDto,
  ) {
    return this.authManager.verifySmsValidate(
      smsTokenType,
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
  @Post('/forget-password')
  async forgetPassword(
    @Body() request: AuthForgetPasswordReqDto,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.forgetPassword(
      request.mobile,
      request.newPassword,
      request.token,
    );
  }

  @Post('/reset-password')
  async resetPassword(
    @Request() req,
    @Body() request: AuthResetPasswordReqDto,
    @RequiredHeader('x-forwarded-for') clientIp: string,
  ) {
    return this.authManager.resetPassword(req.user.uuid, request.newPassword);
  }

  @Public()
  @Get('/oauth/nonce/:authType')
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
