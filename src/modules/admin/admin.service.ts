import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class AdminService {
  constructor(private readonly configService: ConfigService) {}

  async verifyApiKey(reqKey: string): Promise<boolean> {
    const key = this.configService.get<string>('message.CMS_MESSAGE_API_KEY');
    if (reqKey !== key) {
      throw new ApiException(ResponseCode.STATUS_4014_UNAUTHORIZED);
    }
    return true;
  }
}
