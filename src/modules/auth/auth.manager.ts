import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SmsUtil } from '../../utils/sms/sms.util';
import { User, UserAuthType } from '../../database/mysql/entities/user.entity';
import { AppResponse } from '../../common/response/app.response';
import { ResponseCode } from '../../common/response/response.code';
import { AuthLoginRspDto } from './dto/response/auth.login.rsp.dto';
import { DateUtil } from '../../utils/date/date.util';
import { ApiException } from '../../common/exception/api.exception';
import { UserOauthLoginNonce } from '../../database/mysql/entities/user.oauth.login.nonce.entity';
import { GetOauthLoginNonceRspDto } from './dto/response/get.oauth.login.nonce.rsp.dto';
import { GoogleAuthUtil } from '../../utils/google-auth/google.auth.util';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { UserOauthGoogle } from '../../database/mysql/entities/user.oauth.google.entity';
import { FacebookAuthUtil } from '../../utils/facebook-auth/facebook.auth.util';
import { FacebookMeRspDto } from '../../utils/facebook-auth/dto/response/facebook.me.rsp.dto';
import { UserOauthFacebook } from '../../database/mysql/entities/user.oauth.facebook.entity';
import { UserBasicAuth } from '../../database/mysql/entities/user.basic.auth.entity';
import { AuthSmsTokenType } from './enum/auth.sms.token.type';
import { UserSmsToken } from '../../database/mysql/entities/user.sms.token.entity';
import { UserInfoRspDto } from '../user/dto/response/user.info.rsp.dto';

@Injectable()
export class AuthManager {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly smsUtil: SmsUtil,
    private readonly googleAuthUtil: GoogleAuthUtil,
    private readonly facebookAuthUtil: FacebookAuthUtil,
  ) {}

  private readonly dateUtil: DateUtil = new DateUtil();
  private readonly logger = new Logger(AuthManager.name);

  async registrationVerifySmsResend(mobile: string) {
    //check if the mobile is already registered
    const existingUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    if (existingUser != null) {
      throw new ApiException(ResponseCode.STATUS_4002_MOBILE_ALREADY_USED);
    }
    const smsToken: UserSmsToken =
      await this.authService.checkAndCreateSmsTokenByType(
        AuthSmsTokenType.REGISTRATION,
        mobile,
      );
    await this.smsUtil.sendSms(mobile, smsToken.token);
    return new AppResponse();
  }

  async verifySmsValidate(
    type: AuthSmsTokenType,
    mobile: string,
    token: string,
  ) {
    //check if the sms token is valid, won't deactivate the token
    await this.authService.checkIsValidSmsToken(type, mobile, token);
    return new AppResponse();
  }

  async registerByBasicAuth(
    mobile: string,
    password: string,
    token: string,
    email: string,
    clientIp: string,
  ): Promise<AppResponse> {
    //check if the mobile/email is already registered
    const existingMobileUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    if (existingMobileUser != null) {
      //disable all existing tokens
      await this.authService.deactivateAllExistingSmsTokenByTypeAndMobile(
        AuthSmsTokenType.REGISTRATION,
        mobile,
      );
      throw new ApiException(ResponseCode.STATUS_4002_MOBILE_ALREADY_USED);
    }
    if (email != null) {
      const existingEmailUser: User = await this.authService.findOneUserByEmail(
        email,
      );
      if (existingEmailUser != null) {
        //disable all existing tokens
        await this.authService.deactivateAllExistingSmsTokenByTypeAndMobile(
          AuthSmsTokenType.REGISTRATION,
          mobile,
        );
        throw new ApiException(ResponseCode.STATUS_4001_EMAIL_ALREADY_USED);
      }
    }

    //check if the sms token is valid, won't deactivate the token
    await this.authService.checkIsValidSmsToken(
      AuthSmsTokenType.REGISTRATION,
      mobile,
      token,
    );
    //disable all existing tokens
    await this.authService.deactivateAllExistingSmsTokenByTypeAndMobile(
      AuthSmsTokenType.REGISTRATION,
      mobile,
    );

    //create user
    const user: User = await this.authService.createUserByBasicAuth(
      mobile,
      password,
      email,
    );
    const rsp: AuthLoginRspDto = await this.authService.loginUser(
      user,
      clientIp,
    );
    return new AppResponse(rsp);
  }

  async loginByBasicAuth(user: User, clientIp: string): Promise<AppResponse> {
    const rsp: AuthLoginRspDto = await this.authService.loginUser(
      user,
      clientIp,
    );
    return new AppResponse(rsp);
  }

  async getOauthLoginNonce(authType: UserAuthType): Promise<AppResponse> {
    if (authType === UserAuthType.BASIC) {
      this.logger.error('basic auth no need nonce...');
      throw new ApiException(ResponseCode.STATUS_4004_BAD_REQUEST);
    }
    //issue nonce
    const nonceEntity: UserOauthLoginNonce =
      await this.authService.createOauthLoginNonce(authType);

    return new AppResponse(
      new GetOauthLoginNonceRspDto(
        nonceEntity.authType,
        nonceEntity.nonce,
        nonceEntity.expiryDate,
      ),
    );
  }

  async loginByOauthGoogle(
    idToken: string,
    clientIp: string,
  ): Promise<AppResponse> {
    // https://developers.google.com/identity/sign-in/android/backend-auth
    //check id token with google
    const payload: TokenPayload = await this.googleAuthUtil.verify(idToken);
    //todo: remove this logger
    this.logger.log('google payload: ' + JSON.stringify(payload));
    if (payload.sub == null || payload.email == null) {
      throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
    }

    //check if the nonce exist in database
    await this.authService.findAndDeactivateOneNonceByAuthTypeAndNonce(
      UserAuthType.GOOGLE,
      payload.nonce,
    );

    //check if the user exist in database by email
    let user: User = await this.authService.findOneUserByEmail(payload.email);
    //check if the user exist in database by sub(google id)
    const userOauthGoogle: UserOauthGoogle =
      await this.authService.findOneUserOauthGoogleBySub(payload.sub);

    //error1: email already used by basic auth
    if (user != null && user.authType === UserAuthType.BASIC) {
      this.logger.error('email already used by basic auth: ' + payload.email);
      throw new ApiException(ResponseCode.STATUS_4001_EMAIL_ALREADY_USED);
    }
    //error2: sub email changed for whatever reasons
    if (userOauthGoogle != null && userOauthGoogle.email !== payload.email) {
      this.logger.error(
        'email not match with database. Expected: ' + userOauthGoogle.email,
        ',received: ' + payload.email,
      );
      throw new ApiException(ResponseCode.STATUS_4001_EMAIL_ALREADY_USED);
    }

    //registration
    if (user == null) {
      //create user
      user = await this.authService.createUserByOauthGoogle(payload);
    }
    //login
    const rsp: AuthLoginRspDto = await this.authService.loginUser(
      user,
      clientIp,
    );

    return new AppResponse(rsp);
  }

  async loginByOauthFacebook(accessToken: string, clientIp: string) {
    await this.facebookAuthUtil.debugToken(accessToken);
    const payload: FacebookMeRspDto = await this.facebookAuthUtil.me(
      accessToken,
    );
    if (payload.id == null || payload.email == null) {
      throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
    }

    //check if the user exist in database by email
    let user: User = await this.authService.findOneUserByEmail(payload.email);
    //check if the user exist in database by sub(google id)
    const userOauthFacebook: UserOauthFacebook =
      await this.authService.findOneUserOauthFacebookByFacebookId(payload.id);

    //error1: email already used by basic auth
    if (user != null && user.authType === UserAuthType.BASIC) {
      this.logger.error('email already used by basic auth: ' + payload.email);
      throw new ApiException(ResponseCode.STATUS_4001_EMAIL_ALREADY_USED);
    }
    //error2: sub email changed for whatever reasons
    if (
      userOauthFacebook != null &&
      userOauthFacebook.email !== payload.email
    ) {
      this.logger.error(
        'email not match with database. Expected: ' + userOauthFacebook.email,
        ',received: ' + payload.email,
      );
      throw new ApiException(ResponseCode.STATUS_4001_EMAIL_ALREADY_USED);
    }

    //registration
    if (user == null) {
      //create user
      user = await this.authService.createUserByOauthFacebook(payload);
    }
    //login
    const rsp: AuthLoginRspDto = await this.authService.loginUser(
      user,
      clientIp,
    );
    return new AppResponse(rsp);
  }

  async forgetPasswordVerifySmsResend(mobile: string) {
    //check if the mobile is already registered
    const existingUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    if (existingUser == null) {
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }
    const smsToken: UserSmsToken =
      await this.authService.checkAndCreateSmsTokenByType(
        AuthSmsTokenType.FORGET_PASSWORD,
        mobile,
      );
    await this.smsUtil.sendSms(mobile, smsToken.token);
    return new AppResponse();
  }

  async forgetPassword(
    mobile: string,
    newPassword: string,
    token: string,
  ): Promise<AppResponse> {
    //check if the mobile/email is already registered
    const existingMobileUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    const userBasicAuth: UserBasicAuth =
      await this.authService.findOneUserBasicAuthByUsername(mobile);
    if (existingMobileUser == null || userBasicAuth == null) {
      //disable all existing tokens
      await this.authService.deactivateAllExistingSmsTokenByTypeAndMobile(
        AuthSmsTokenType.FORGET_PASSWORD,
        mobile,
      );
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }

    //check if the sms token is valid, won't deactivate the token
    await this.authService.checkIsValidSmsToken(
      AuthSmsTokenType.FORGET_PASSWORD,
      mobile,
      token,
    );
    //disable all existing tokens
    await this.authService.deactivateAllExistingSmsTokenByTypeAndMobile(
      AuthSmsTokenType.FORGET_PASSWORD,
      mobile,
    );

    //update password
    await this.authService.resetPasswordByBasicAuth(userBasicAuth, newPassword);

    return new AppResponse();
  }

  async resetPassword(
    userUuid: string,
    newPassword: string,
  ): Promise<AppResponse> {
    //check if the mobile/email is already registered
    const user: User = await this.userService.findOneUserByUuid(userUuid);

    const userBasicAuth: UserBasicAuth =
      await this.authService.findOneUserBasicAuthByUsername(user.mobile);
    if (user == null || userBasicAuth == null) {
      //disable all existing tokens
      throw new ApiException(ResponseCode.STATUS_4003_USER_NOT_EXIST);
    }

    //update password
    await this.authService.resetPasswordByBasicAuth(userBasicAuth, newPassword);

    return new AppResponse();
  }

  async changeMobileVerifySmsResend(mobile: string) {
    //check if the mobile is already registered
    const existingUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    if (existingUser != null) {
      throw new ApiException(ResponseCode.STATUS_4002_MOBILE_ALREADY_USED);
    }
    const smsToken: UserSmsToken =
      await this.authService.checkAndCreateSmsTokenByType(
        AuthSmsTokenType.CHANGE_MOBILE,
        mobile,
      );
    await this.smsUtil.sendSms(mobile, smsToken.token);
    return new AppResponse();
  }
}
