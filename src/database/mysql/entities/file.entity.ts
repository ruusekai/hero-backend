import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class File extends BaseEntity {
  constructor(
    uuid: string,
    filename: string,
    fullPath: string,
    mimetype: string,
    originalFilename: string,
  ) {
    super();
    this.uuid = uuid;
    this.filename = filename;
    this.fullPath = fullPath;
    this.mimetype = mimetype;
    this.originalFilename = originalFilename;
  }
  @Column({ name: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'filename' })
  filename: string;

  @Column({ name: 'full_path' })
  fullPath: string;

  @Column({ name: 'mimetype' })
  mimetype: string;

  @Column({ name: 'original_filename' })
  originalFilename: string;
}
