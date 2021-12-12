import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from '../../utils/crypto/crypto.util';
import { User, UserAuthType } from '../../database/mysql/entities/user.entity';
import { AuthLoginRspDto } from './dto/response/auth.login.rsp.dto';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from '../../utils/date/date.util';
import { UserRegistrationSmsTokenRepository } from '../../database/mysql/repositories/user.registration.sms.token.repository';
import { UserRegistrationSmsToken } from '../../database/mysql/entities/user.registration.sms.token.entity';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly userRegisterSmsTokenRepository: UserRegistrationSmsTokenRepository,
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

  async createRegistrationSmsToken(
    mobile: string,
  ): Promise<UserRegistrationSmsToken> {
    const expiryDate: Date = this.dateUtil.addSeconds(
      Date.now(),
      Number(
        this.configService.get<string>(
          'user.forgetPassword.TOKEN_EXPIRY_TIME_IN_SECOND',
        ),
      ),
    );
    const token: string = await this.getRandomNumber();

    const smsToken: UserRegistrationSmsToken = new UserRegistrationSmsToken();
    smsToken.type = AuthSmsTokenType.REGISTRATION;
    smsToken.token = token;
    smsToken.mobile = mobile;
    smsToken.expiryDate = expiryDate;
    return await this.userRegisterSmsTokenRepository.createToken(smsToken);
  }

  async checkIsValidSmsToken(mobile: string, token: string): Promise<boolean> {
    //check the db to see if the token is valid
    const smsToken: UserRegistrationSmsToken =
      await this.findOneTokenByMobileAndToken(mobile, token);
    if (smsToken == null) {
      throw new ApiException(ResponseCode.STATUS_4012_SMS_TOKEN_INVALID);
    }
    //verify token expiry date
    if (Date.now() > smsToken.expiryDate.getTime()) {
      throw new ApiException(ResponseCode.STATUS_4011_SMS_TOKEN_EXPIRED);
    }
    return true;
  }

  async deactivateAllExistingRegistrationSmsTokenByMobile(
    mobile: string,
  ): Promise<boolean> {
    await this.userRegisterSmsTokenRepository.deactivateExistingTokenByMobile(
      mobile,
    );
    return true;
  }

  async deactivateOneRegistrationSmsTokenByMobileAndToken(
    mobile: string,
    token: string,
  ): Promise<boolean> {
    await this.userRegisterSmsTokenRepository.deactivateOneTokenByMobileAndToken(
      mobile,
      token,
    );
    return true;
  }

  async findOneTokenByMobileAndToken(
    mobile: string,
    token: string,
  ): Promise<UserRegistrationSmsToken> {
    return await this.userRegisterSmsTokenRepository.findOneTokenByMobileAndTokenAndIsDeletedFalse(
      mobile,
      token,
    );
  }

  async findTokenByMobileAndCreatedDateMoreThanOrderByCreatedDateDesc(
    mobile: string,
    createdDate: Date,
  ): Promise<UserRegistrationSmsToken[]> {
    return await this.userRegisterSmsTokenRepository.findTokenByMobileAndCreatedDateMoreThanAndIsDeletedFalseOrderByCreatedDateDesc(
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
    return await this.userBasicAuthRepository.save(userBasicAuth);
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
}
