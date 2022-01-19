import { Column, Entity } from 'typeorm';
import { CountryBaseEntity } from './country.base.entity';

@Entity()
export class Country extends CountryBaseEntity {
  @Column({ name: 'name' })
  name: string;
}
