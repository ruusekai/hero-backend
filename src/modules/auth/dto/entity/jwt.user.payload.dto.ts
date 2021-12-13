import { UserAuthType } from '../../../../database/mysql/entities/user.entity';

export class JwtUserPayloadDto {
  uuid: string;
  authType: UserAuthType;
  mobile: string;
  email: string;
}
