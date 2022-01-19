import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryManager } from './country.manager';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MySqlRepositoryModule, ConfigModule],
  controllers: [CountryController],
  providers: [CountryManager, CountryService],
})
export class CountryModule {}
