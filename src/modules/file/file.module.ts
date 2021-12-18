import { Module } from '@nestjs/common';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';
import { FileService } from './file.service';
import { FileManager } from './file.manager';
import { FileController } from './file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MySqlRepositoryModule, ConfigModule],
  controllers: [FileController],
  providers: [FileManager, FileService],
  exports: [FileService],
})
export class FileModule {}
