import {} from '@nestjs/common';
import { ApiStatus } from './api.status';
import { ResponseCode } from './response.code';
import { ResponseStatus } from './response.status';

export class AppResponse {
  private readonly status: ApiStatus;
  private readonly data: Promise<any>;

  constructor(_data?: any, _rpsStatus?: ResponseStatus) {
    this.status =
      _rpsStatus != null
        ? new ApiStatus(_rpsStatus)
        : new ApiStatus(ResponseCode.STATUS_1000_SUCCESS);
    this.data = _data;
  }

  get getStatus(): ApiStatus {
    return this.status;
  }

  get getData() {
    return this.data;
  }
}
