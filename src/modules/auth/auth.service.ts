import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from '../../utils/crypto/crypto.util';
import { User, UserAuthType } from '../../database/mysql/entities/user.entity';
import { AuthLoginRspDto } from './dto/response/auth.login.rsp.dto';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from '../../utils/date/date.util';
import { AuthSmsTokenType } from './enum/auth.sms.token.type';
import { ResponseCode } from '../../common/response/response.code';
import { UserBasicAuth } from '../../database/mysql/entities/user.basic.auth.entity';
import { UserBasicAuthRepository } from '../../database/mysql/repositories/user.basic.auth.repository';
import { ApiException } from '../../common/exception/api.exception';
import { UserOauthLoginNonce } from '../../database/mysql/entities/user.oauth.login.nonce.entity';
import { UserOauthLoginNonceRepository } from '../../database/mysql/repositories/user.oauth.login.nonce.repository';
import { UpdateResult } from 'typeorm';
import { UserOauthFacebookRepository } from '../../database/mysql/repositories/user.oauth.facebook.repository';
import { UserOauthGoogleRepository } from '../../database/mysql/repositories/user.oauth.google.repository';
import { UserRepository } from '../../database/mysql/repositories/user.repository';
import { UserOauthGoogle } from '../../database/mysql/entities/user.oauth.google.entity';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { FacebookMeRspDto } from '../../utils/facebook-auth/dto/response/facebook.me.rsp.dto';
import { UserOauthFacebook } from '../../database/mysql/entities/user.oauth.facebook.entity';
import { UserSmsTokenRepository } from '../../database/mysql/repositories/user.sms.token.repository';
import { UserSmsToken } from '../../database/mysql/entities/user.sms.token.entity';
import { UserInfoRspDto } from '../user/dto/response/user.info.rsp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userSmsTokenRepository: UserSmsTokenRepository,
    private readonly userBasicAuthRepository: UserBasicAuthRepository,
    private readonly userOauthLoginNonceRepository: UserOauthLoginNonceRepository,
    private readonly userOauthFacebookRepository: UserOauthFacebookRepository,
    private readonly userOauthGoogleRepository: UserOauthGoogleRepository,
  ) {}

  private readonly dateUtil: DateUtil = new DateUtil();
  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, plainPassword: string): Promise<any> {
    const userBasicAuth: UserBasicAuth =
      await this.findOneUserBasicAuthByUsername(username);

    this.logger.log('userBasicAuth: %s', JSON.stringify(userBasicAuth));
    const isValidPassword: boolean = await CryptoUtil.verifyPassword(
      userBasicAuth.password,
      plainPassword,
    );
    if (!userBasicAuth || !isValidPassword) {
      return null;
    }
    return userBasicAuth.user;
  }

  async createUserByBasicAuth(
    mobile: string,
    password: string,
    email: string,
  ): Promise<User> {
    const hash: string = await CryptoUtil.hashWithSalt(password);
    let user: User = new User(UserAuthType.BASIC, mobile, email, true, false);
    user = await this.userService.saveUser(user);

    let userBasicAuth: UserBasicAuth = new UserBasicAuth(
      mobile,
      hash,
      user.uuid,
    );
    userBasicAuth = await this.saveUserBasicAuth(userBasicAuth);
    return user;
  }

  async createUserByOauthGoogle(payload: TokenPayload): Promise<User> {
    let user: User = new User(
      UserAuthType.GOOGLE,
      null,
      payload.email,
      true,
      false,
    );
    user = await this.userService.saveUser(user);

    const userOauthGoogle: UserOauthGoogle = new UserOauthGoogle(
      user.uuid,
      payload.sub,
      payload.email,
      payload.email_verified,
      payload.name,
      payload.picture,
      payload.given_name,
      payload.family_name,
      payload.locale,
    );
    await this.userOauthGoogleRepository.saveUserOauthGoogle(userOauthGoogle);
    return user;
  }

  async createUserByOauthFacebook(payload: FacebookMeRspDto): Promise<User> {
    let user: User = new User(
      UserAuthType.FACEBOOK,
      null,
      payload.email,
      true,
      false,
    );
    user = await this.userService.saveUser(user);

    const userOauthFacebook: UserOauthFacebook = new UserOauthFacebook(
      user.uuid,
      payload.id,
      payload.email,
      payload.name,
    );
    await this.userOauthFacebookRepository.saveUserOauthFacebook(
      userOauthFacebook,
    );
    return user;
  }

  async loginUser(user: User, clientIp: string): Promise<AuthLoginRspDto> {
    //update login record
    user.lastLoginDate = new Date(Date.now());
    user.lastLoginIp = clientIp;
    await this.userService.saveUser(user);
    //issue jwt token
    const token = await this.signJwtToken(user);
    return new AuthLoginRspDto(user.authType, user.uuid, token);
  }

  async signJwtToken(user: User): Promise<string> {
    return this.jwtService.sign({
      uuid: user.uuid,
      authType: user.authType,
      mobile: user.mobile,
      email: user.email,
    });
  }

  async createSmsTokenByType(
    type: AuthSmsTokenType,
    mobile: string,
  ): Promise<UserSmsToken> {
    const expiryDate: Date = this.dateUtil.addSeconds(
      Date.now(),
      Number(
        this.configService.get<string>(
          'user.forgetPassword.TOKEN_EXPIRY_TIME_IN_SECOND',
        ),
      ),
    );
    const token: string = await this.getRandomNumber();

    const smsToken: UserSmsToken = new UserSmsToken();
    smsToken.type = type;
    smsToken.token = token;
    smsToken.mobile = mobile;
    smsToken.expiryDate = expiryDate;
    return await this.userSmsTokenRepository.createToken(smsToken);
  }

  async checkIsValidSmsToken(
    type: AuthSmsTokenType,
    mobile: string,
    token: string,
  ): Promise<boolean> {
    //check the db to see if the token is valid
    const smsToken: UserSmsToken =
      await this.findOneTokenByTypeAndMobileAndToken(type, mobile, token);
    if (smsToken == null) {
      throw new ApiException(ResponseCode.STATUS_4012_SMS_TOKEN_INVALID);
    }
    //verify token expiry date
    if (Date.now() > smsToken.expiryDate.getTime()) {
      throw new ApiException(ResponseCode.STATUS_4011_SMS_TOKEN_EXPIRED);
    }
    return true;
  }

  async deactivateAllExistingSmsTokenByTypeAndMobile(
    type: AuthSmsTokenType,
    mobile: string,
  ): Promise<boolean> {
    await this.userSmsTokenRepository.deactivateExistingTokenByTypeAndMobile(
      type,
      mobile,
    );
    return true;
  }

  async deactivateOneSmsTokenByMobileAndToken(
    type: AuthSmsTokenType,
    mobile: string,
    token: string,
  ): Promise<boolean> {
    await this.userSmsTokenRepository.deactivateOneTokenByTypeAndMobileAndToken(
      type,
      mobile,
      token,
    );
    return true;
  }

  async findOneTokenByTypeAndMobileAndToken(
    type: AuthSmsTokenType,
    mobile: string,
    token: string,
  ): Promise<UserSmsToken> {
    return await this.userSmsTokenRepository.findOneTokenByTypeAndMobileAndTokenAndIsDeletedFalse(
      type,
      mobile,
      token,
    );
  }

  async findLatestSmsTokenListByTypeAndMobileAndCreatedDate(
    type: AuthSmsTokenType,
    mobile: string,
    createdDate: Date,
  ): Promise<UserSmsToken[]> {
    return await this.userSmsTokenRepository.findTokenByTypeAndMobileAndCreatedDateMoreThanAndIsDeletedFalseOrderByCreatedDateDesc(
      type,
      mobile,
      createdDate,
    );
  }

  async getRandomNumber(): Promise<string> {
    //get random number from 0 - 999999
    const randomNumber: number = Math.floor(Math.random() * 1000000);
    //add padding zeros
    const token: string = randomNumber.toString().padStart(6, '0');
    this.logger.log('token: ' + token);
    return token;
  }

  async saveUserBasicAuth(
    userBasicAuth: UserBasicAuth,
  ): Promise<UserBasicAuth> {
    return await this.userBasicAuthRepository.saveUserBasicAuth(userBasicAuth);
  }

  async findOneUserBasicAuthByUsername(
    username: string,
  ): Promise<UserBasicAuth> {
    return await this.userBasicAuthRepository.findOneUserBasicAuthByUsername(
      username,
    );
  }

  async createOauthLoginNonce(
    authType: UserAuthType,
  ): Promise<UserOauthLoginNonce> {
    const expiryDate: Date = this.dateUtil.addSeconds(
      Date.now(),
      Number(
        this.configService.get<string>(
          'user.forgetPassword.TOKEN_EXPIRY_TIME_IN_SECOND',
        ),
      ),
    );

    const nonceEntity: UserOauthLoginNonce = new UserOauthLoginNonce(
      authType,
      expiryDate,
    );
    return await this.userOauthLoginNonceRepository.createNonce(nonceEntity);
  }

  async findAndDeactivateOneNonceByAuthTypeAndNonce(
    authType: UserAuthType,
    nonce: string,
  ) {
    const updateResult: UpdateResult =
      await this.userOauthLoginNonceRepository.deactivateOneNonceByAuthTypeAndNonce(
        authType,
        nonce,
      );
    if (updateResult.affected === 0) {
      //i.e. the nonce is not found in db
      throw new ApiException(ResponseCode.STATUS_4015_OAUTH_TOKEN_INVALID);
    }
  }

  async findOneUserOauthFacebookByFacebookId(facebookId: string) {
    return await this.userOauthFacebookRepository.findOneUserOauthFacebookByFacebookIdAndIsDeletedFalse(
      facebookId,
    );
  }

  async findOneUserOauthGoogleBySub(sub: string) {
    return await this.userOauthGoogleRepository.findOneUserOauthGoogleBySubAndIsDeletedFalse(
      sub,
    );
  }

  async findOneUserByMobile(mobile: string): Promise<User> {
    return await this.userRepository.findOneUserByOptionsAndIsDeletedFalse({
      mobile: mobile,
    });
  }
  async findOneUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneUserByOptionsAndIsDeletedFalse({
      email: email,
    });
  }

  async resetPasswordByBasicAuth(
    userBasicAuth: UserBasicAuth,
    newPassword: string,
  ): Promise<UserBasicAuth> {
    const hash: string = await CryptoUtil.hashWithSalt(newPassword);

    userBasicAuth.password = hash;
    userBasicAuth = await this.saveUserBasicAuth(userBasicAuth);
    return userBasicAuth;
  }

  async checkAndCreateSmsTokenByType(
    type: AuthSmsTokenType,
    mobile: string,
  ): Promise<UserSmsToken> {
    //check how many time of retrial in the last 24 hours
    const tokenList: UserSmsToken[] =
      await this.findLatestSmsTokenListByTypeAndMobileAndCreatedDate(
        type,
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
    await this.deactivateAllExistingSmsTokenByTypeAndMobile(type, mobile);
    //create new tokens
    const smsToken: UserSmsToken = await this.createSmsTokenByType(
      type,
      mobile,
    );
    return smsToken;
  }

  async changeMobile(
    user: User,
    newMobile: string,
    token: string,
  ): Promise<UserInfoRspDto> {
    const existingUser: User = await this.findOneUserByMobile(newMobile);
    const oldMobile: string = user.mobile;

    if (existingUser != null || oldMobile === newMobile) {
      //disable all existing tokens
      await this.deactivateAllExistingSmsTokenByTypeAndMobile(
        AuthSmsTokenType.CHANGE_MOBILE,
        newMobile,
      );
      //no need to change
      throw new ApiException(ResponseCode.STATUS_4002_MOBILE_ALREADY_USED);
    }
    //check if the sms token is valid, won't deactivate the token
    await this.checkIsValidSmsToken(
      AuthSmsTokenType.CHANGE_MOBILE,
      newMobile,
      token,
    );
    //disable all existing tokens
    await this.deactivateAllExistingSmsTokenByTypeAndMobile(
      AuthSmsTokenType.CHANGE_MOBILE,
      newMobile,
    );
    user.mobile = newMobile;
    user = await this.userService.saveUser(user);

    if (user.authType === UserAuthType.BASIC) {
      let userBasicAuth: UserBasicAuth =
        await this.findOneUserBasicAuthByUsername(oldMobile);
      userBasicAuth.username = newMobile;
      userBasicAuth = await this.saveUserBasicAuth(userBasicAuth);
    }
    return new UserInfoRspDto(user);
  }

  async changeEmail(user: User, newEmail: string): Promise<UserInfoRspDto> {
    user.email = newEmail;
    user = await this.userService.saveUser(user);

    return new UserInfoRspDto(user);
  }
}
