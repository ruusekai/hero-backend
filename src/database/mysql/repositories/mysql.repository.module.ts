import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [],
  exports: [TypeOrmModule],
})
export class MySqlRepositoryModule {}
