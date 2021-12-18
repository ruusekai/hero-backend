export class ThumbnailDto {
  constructor(filename: string, url: string) {
    this.filename = filename;
    this.url = url;
  }
  filename: string;
  url: string;
}
export class FileDto {
  constructor(
    fileUuid: string,
    filename: string,
    url: string,
    thumbnail: ThumbnailDto,
  ) {
    this.fileUuid = fileUuid;
    this.filename = filename;
    this.url = url;
    this.thumbnail = thumbnail;
  }
  fileUuid: string;
  filename: string;
  url: string;
  thumbnail: ThumbnailDto;
}
