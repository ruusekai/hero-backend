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
import { CountryRepository } from './country.repository';
import { CountryRegionRepository } from './country.region.repository';
import { CountryDistrictRepository } from './country.district.repository';
import { UserCouponRepository } from './user.coupon.repository';
import { TaskRepository } from './task.repository';
import { PaymentIntentRepository } from './payment.intent.repository';
import { StripeWebhookRepository } from './stripe.webhook.repository';

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
      CountryRepository,
      CountryRegionRepository,
      CountryDistrictRepository,
      UserCouponRepository,
      TaskRepository,
      PaymentIntentRepository,
      StripeWebhookRepository,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class MySqlRepositoryModule {}
