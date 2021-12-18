import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

import { Module } from '@nestjs/common';
import { UserRegistrationSmsTokenRepository } from './user.registration.sms.token.repository';
import { UserBasicAuthRepository } from './user.basic.auth.repository';
import { UserOauthLoginNonceRepository } from './user.oauth.login.nonce.repository';
import { UserOauthFacebookRepository } from './user.oauth.facebook.repository';
import { UserOauthGoogleRepository } from './user.oauth.google.repository';
import { FileRepository } from './file.repository';
import { FileThumbnailRepository } from './file.thumbnail.repository';
import { UserKycRepository } from './user.kyc.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserRegistrationSmsTokenRepository,
      UserBasicAuthRepository,
      UserOauthLoginNonceRepository,
      UserOauthFacebookRepository,
      UserOauthGoogleRepository,
      FileRepository,
      FileThumbnailRepository,
      UserKycRepository,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class MySqlRepositoryModule {}
