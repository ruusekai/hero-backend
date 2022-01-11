import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

import { Module } from '@nestjs/common';
import { UserBasicAuthRepository } from './user.basic.auth.repository';
import { UserOauthLoginNonceRepository } from './user.oauth.login.nonce.repository';
import { UserOauthFacebookRepository } from './user.oauth.facebook.repository';
import { UserOauthGoogleRepository } from './user.oauth.google.repository';
import { FileRepository } from './file.repository';
import { FileThumbnailRepository } from './file.thumbnail.repository';
import { UserKycRepository } from './user.kyc.repository';
import { UserSmsTokenRepository } from './user.sms.token.repository';
import { UserProfileRepository } from './user.profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserProfileRepository,
      UserSmsTokenRepository,
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
