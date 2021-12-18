import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from '../user/user.service';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CryptoUtilModule } from '../../utils/crypto/crypto.util.module';
import { SmsUtilModule } from '../../utils/sms/sms.util.module';
import { AuthManager } from './auth.manager';
import { GoogleAuthUtil } from '../../utils/google-auth/google.auth.util';
import { GoogleAuthUtilModule } from '../../utils/google-auth/google.auth.util.module';
import { FacebookAuthUtilModule } from '../../utils/facebook-auth/facebook.auth.util.module';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    ConfigModule,
    MySqlRepositoryModule,
    CryptoUtilModule,
    SmsUtilModule,
    GoogleAuthUtilModule,
    FacebookAuthUtilModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtConfig.secret'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthManager,
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
