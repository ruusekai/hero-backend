import { Injectable, Logger } from '@nestjs/common';
import { FileService } from './file.service';
import { promises as fsPromise } from 'fs';
import * as mime from 'mime-types';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { File } from '../../database/mysql/entities/file.entity';
import { FileThumbnail } from '../../database/mysql/entities/file.thumbnail.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FileDto, ThumbnailDto } from './dto/entity/file.dto';
import { AppResponse } from '../../common/response/app.response';

@Injectable()
export class FileManager {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
    const domain = this.configService.get<string>('app.domain');
    const globalPrefix = this.configService.get<string>('app.globalPrefix');
    this.getFileUrl = `${domain}/${globalPrefix}/file/`;
    this.getThumbnailUrl = `${domain}/${globalPrefix}/file/thumbnail/`;
  }
  private readonly logger = new Logger(FileManager.name);
  private readonly getFileUrl;
  private readonly getThumbnailUrl;

  async uploadFile(newPathOnly: string, file: Express.Multer.File) {
    const oldPath = file.path;

    try {
      if (!file.mimetype.includes('image')) {
        this.logger.error('[file] the file is not an image!');
        throw new ApiException(ResponseCode.STATUS_6001_FILE_SERVICE_ERROR);
      }
      if (file.size <= 0) {
        this.logger.error('[file] the file is empty');
        throw new ApiException(ResponseCode.STATUS_6001_FILE_SERVICE_ERROR);
      }

      const fileUuid: string = uuidv4();
      const ext: string = await mime.extension(file.mimetype);
      const filenameWithExt: string = fileUuid + '.' + ext;
      const newPath = `${newPathOnly}/${filenameWithExt}`;
      const thumbnailFilenameWithExt: string =
        fileUuid + '-thumbnail' + '.' + ext;
      const thumbnailNewPath = `${newPathOnly}/${thumbnailFilenameWithExt}`;
      //move file from temp folder to correct folder
      await fsPromise.mkdir(newPathOnly, { recursive: true });
      await fsPromise.rename(oldPath, newPath);

      //save file to db
      let fileEntity: File = new File(
        fileUuid,
        filenameWithExt,
        newPath,
        file.mimetype,
        file.originalname,
      );
      fileEntity = await this.fileService.saveFile(fileEntity);

      //create thumbnail
      const thumbnailEntity: FileThumbnail =
        await this.fileService.createThumbnail(
          thumbnailNewPath,
          thumbnailFilenameWithExt,
          fileEntity,
        );
      //create rsp dto
      const thumbnailDto: ThumbnailDto = new ThumbnailDto(
        thumbnailEntity.filename,
        this.getThumbnailUrl + thumbnailEntity.fileUuid,
      );
      const fileDto: FileDto = new FileDto(
        fileEntity.uuid,
        fileEntity.filename,
        this.getFileUrl + fileEntity.uuid,
        thumbnailDto,
      );
      this.logger.log('successfully resize and move file from temp');
      return new AppResponse(fileDto);
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
      await fsPromise.unlink(oldPath);
      throw new ApiException(ResponseCode.STATUS_6001_FILE_SERVICE_ERROR);
    }
  }
}
