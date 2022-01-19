import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country-region')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }
}
