import { Controller, Get } from '@nestjs/common';
import { AppResponse } from './common/response/app.response';

@Controller()
export class AppController {
  constructor() {}

  @Get('health-check')
  healthCheck() {
    return new AppResponse();
  }
}
