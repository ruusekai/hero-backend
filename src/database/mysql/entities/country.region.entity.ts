import { Column, Entity } from 'typeorm';
import { CountryBaseEntity } from './country.base.entity';

@Entity()
export class CountryRegion extends CountryBaseEntity {
  @Column({ name: 'country_id' })
  countryId: string;

  @Column({ name: 'name' })
  name: string;
}
