import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileManager } from './file.manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { ConfigService } from '@nestjs/config';
import { File } from '../../database/mysql/entities/file.entity';
import { Public } from '../../common/decorator/public.endpoint.decorator';
import { FileService } from './file.service';
import { FileThumbnail } from '../../database/mysql/entities/file.thumbnail.entity';
import { FileCategory } from '../../common/enum/file.category';

@Controller('/file')
export class FileController {
  constructor(
    private readonly fileManager: FileManager,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(FileController.name);

  @Public()
  @Get('/thumbnail/:fileUuid')
  async getThumbnailByParentFileUuid(
    @Param('fileUuid') fileUuid: string,
    @Res() res,
  ) {
    const thumbnailEntity: FileThumbnail =
      await this.fileService.findOneFileThumbnailByFileUuid(fileUuid);
    if (thumbnailEntity != null) {
      const filePath = thumbnailEntity.fullPath.replace('public/', '');
      res.sendFile(filePath, { root: 'public' });
    } else {
      throw new BadRequestException();
    }
  }

  @Public()
  @Get(':fileUuid')
  async getFileByFileUuid(@Param('fileUuid') fileUuid: string, @Res() res) {
    const fileEntity: File = await this.fileService.findOneFileByUuid(fileUuid);
    if (fileEntity != null) {
      const filePath = fileEntity.fullPath.replace('public/', '');
      res.sendFile(filePath, { root: 'public' });
    } else {
      throw new BadRequestException();
    }
  }

  @Post('/upload/:fileCategory')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'public/image/temp',
      limits: { fileSize: 3145728 },
    }),
  )
  async uploadFile(
    @Param('fileCategory') fileCategory: FileCategory,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file != null) {
      let newPathOnly: string;
      this.logger.log('file: ' + JSON.stringify(file));
      if (fileCategory === FileCategory.KYC) {
        newPathOnly = `public/image/user/${req.user.uuid}`;
      }
      return this.fileManager.uploadFile(newPathOnly, file);
    } else {
      this.logger.error('[file] empty file');
      throw new ApiException(ResponseCode.STATUS_6001_FILE_SERVICE_ERROR);
    }
  }
}
