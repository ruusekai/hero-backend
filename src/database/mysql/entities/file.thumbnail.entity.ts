import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class FileThumbnail extends BaseEntity {
  constructor(fileUuid: string, filename: string, fullPath: string) {
    super();
    this.fileUuid = fileUuid;
    this.filename = filename;
    this.fullPath = fullPath;
  }
  @Column({ name: 'file_uuid' })
  fileUuid: string;

  @Column({ name: 'filename' })
  filename: string;

  @Column({ name: 'full_path' })
  fullPath: string;
}
