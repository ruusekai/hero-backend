import { Injectable } from '@nestjs/common';
import { CountryService } from './country.service';
import { AppResponse } from '../../common/response/app.response';

@Injectable()
export class CountryManager {
  constructor(private readonly countryService: CountryService) {}

  async findOne(id: string): Promise<AppResponse> {
    const rsp = await this.countryService.findOne(id);
    return new AppResponse(rsp);
  }
}
