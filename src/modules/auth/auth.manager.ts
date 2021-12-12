import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SmsUtil } from '../../utils/sms/sms.util';
import { User, UserAuthType } from '../../database/mysql/entities/user.entity';
import { UserRegistrationSmsToken } from '../../database/mysql/entities/user.registration.sms.token.entity';
import { AppResponse } from '../../common/response/app.response';
import { ResponseCode } from '../../common/response/response.code';
import { UserInfoRspDto } from './dto/response/user.info.rsp.dto';
import { AuthLoginRspDto } from './dto/response/auth.login.rsp.dto';
import { DateUtil } from '../../utils/date/date.util';
import { ApiException } from '../../common/exception/api.exception';
import { UserOauthLoginNonce } from '../../database/mysql/entities/user.oauth.login.nonce.entity';
import { GetOauthLoginNonceRspDto } from './dto/response/get.oauth.login.nonce.rsp.dto';
import { GoogleAuthUtil } from '../../utils/google-auth/google.auth.util';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { UserOauthGoogle } from '../../database/mysql/entities/user.oauth.google.entity';
import { FacebookAuthUtil } from '../../utils/facebook-auth/facebook.auth.util';
import { FacebookDebugTokenRspDto } from '../../utils/facebook-auth/dto/response/facebook.debug.token.rsp.dto';
import { FacebookMeRspDto } from '../../utils/facebook-auth/dto/response/facebook.me.rsp.dto';
import { UserOauthFacebook } from '../../database/mysql/entities/user.oauth.facebook.entity';

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
    //check how many time of retrial in the last 24 hours
    const tokenList: UserRegistrationSmsToken[] =
      await this.authService.findTokenByMobileAndCreatedDateMoreThanOrderByCreatedDateDesc(
        mobile,
        this.dateUtil.subtractDays(Date.now(), 1),
      );
    //if exceed, dont issue token
    if (
      tokenList.length >=
      Number(
        this.configService.get<string>(
          'user.registration.SMS_VERIFY_RESEND_MAX_COUNT',
        ),
      )
    ) {
      throw new ApiException(
        ResponseCode.STATUS_4006_RESEND_SMS_REQUEST_EXCEED_LIMIT,
      );
    }
    //check latest issue token, if within interval, dont issue token
    if (
      tokenList[0] != null &&
      (Date.now() - tokenList[0].createdDate.getTime()) / 1000 <
        Number(
          this.configService.get<string>(
            'user.registration.SMS_VERIFY_RESEND_TIME_INTERVAL_IN_SECOND',
          ),
        )
    ) {
      throw new ApiException(
        ResponseCode.STATUS_4005_RESEND_SMS_REQUEST_TOO_OFTEN,
      );
    }

    //disable all existing tokens
    await this.authService.deactivateAllExistingRegistrationSmsTokenByMobile(
      mobile,
    );
    //create new tokens
    const smsToken: UserRegistrationSmsToken =
      await this.authService.createRegistrationSmsToken(mobile);
    await this.smsUtil.sendSms(smsToken.token);
    return new AppResponse();
  }

  async registrationVerifySmsValidate(mobile: string, token: string) {
    //check if the sms token is valid, won't deactivate the token
    await this.authService.checkIsValidSmsToken(mobile, token);
    return new AppResponse();
  }

  async registerByBasicAuth(
    mobile: string,
    password: string,
    token: string,
    email: string,
    clientIp: string,
  ): Promise<AppResponse> {
    //check if the mobile is already registered
    const existingUser: User = await this.authService.findOneUserByMobile(
      mobile,
    );
    if (existingUser != null) {
      //disable all existing tokens
      await this.authService.deactivateAllExistingRegistrationSmsTokenByMobile(
        mobile,
      );
      throw new ApiException(ResponseCode.STATUS_4002_MOBILE_ALREADY_USED);
    }

    //check if the sms token is valid, won't deactivate the token
    await this.authService.checkIsValidSmsToken(mobile, token);
    //disable all existing tokens
    await this.authService.deactivateAllExistingRegistrationSmsTokenByMobile(
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
}
