import { Column, Entity } from 'typeorm';
import { CountryBaseEntity } from './country.base.entity';

@Entity()
export class CountryDistrict extends CountryBaseEntity {
  @Column({ name: 'region_id' })
  regionId: string;

  @Column({ name: 'name' })
  name: string;
}
