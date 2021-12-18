import { Injectable, Logger } from '@nestjs/common';
import { promises as fsPromise } from 'fs';
import probe = require('probe-image-size');
import sharp = require('sharp');
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { FileRepository } from '../../database/mysql/repositories/file.repository';
import { FileThumbnailRepository } from '../../database/mysql/repositories/file.thumbnail.repository';
import { File } from '../../database/mysql/entities/file.entity';
import { FileThumbnail } from '../../database/mysql/entities/file.thumbnail.entity';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository,
    private readonly fileThumbnailRepository: FileThumbnailRepository,
  ) {}
  private readonly logger = new Logger(FileService.name);

  async createThumbnail(
    thumbnailFileFullPath: string,
    thumbnailFilename: string,
    fileEntity: File,
  ): Promise<FileThumbnail> {
    const maximumSideSizePx = Number(
      this.configService.get<string>('file.THUMBNAIL_SIZE_PX'),
    );
    try {
      const imageBuffer: Buffer = await fsPromise.readFile(fileEntity.fullPath);
      const imageByteLength = imageBuffer.byteLength;
      this.logger.log('[thumbnail] imageByteLength: ' + imageByteLength);
      const imageSize = await probe.sync(imageBuffer);
      this.logger.log('[thumbnail] originalImageSize: ' + imageSize);

      const longerSide =
        imageSize.width > imageSize.height ? 'width' : 'height';
      const isResize = imageSize[longerSide] > maximumSideSizePx ? true : false;
      //resize, or upload the original photo as thumbnail, and save
      const resizedImageBuffer: Buffer = isResize
        ? await sharp(imageBuffer).resize(maximumSideSizePx).toBuffer()
        : imageBuffer;
      await fsPromise.writeFile(thumbnailFileFullPath, resizedImageBuffer);
      //save thumbnail to db
      const thumbnailEntity: FileThumbnail = new FileThumbnail(
        fileEntity.uuid,
        thumbnailFilename,
        thumbnailFileFullPath,
      );
      return await this.saveFileThumbnail(thumbnailEntity);
    } catch (e) {
      this.logger.error(e.stack);
      throw new ApiException(ResponseCode.STATUS_6001_FILE_SERVICE_ERROR);
    }
  }

  async findOneFileByUuid(uuid: string): Promise<File> {
    return await this.fileRepository.findOneFileByUuidAndIsDeletedFalse(uuid);
  }

  async saveFile(file: File): Promise<File> {
    return await this.fileRepository.saveFile(file);
  }

  async findOneFileThumbnailByFileUuid(
    fileUuid: string,
  ): Promise<FileThumbnail> {
    return await this.fileThumbnailRepository.findOneFileThumbnailByFileUuidAndIsDeletedFalse(
      fileUuid,
    );
  }

  async saveFileThumbnail(
    fileThumbnail: FileThumbnail,
  ): Promise<FileThumbnail> {
    return await this.fileThumbnailRepository.saveFileThumbnail(fileThumbnail);
  }
}
