import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseStatus } from '../response/response.status';

export class ApiException extends HttpException {
  private readonly responseStatus: ResponseStatus;
  private readonly exception: unknown;

  constructor(
    _responseStatus: ResponseStatus,
    exception?: unknown,
    status?: number,
  ) {
    super(null, status ? status : HttpStatus.INTERNAL_SERVER_ERROR);
    this.responseStatus = _responseStatus;
    this.exception = exception;
  }

  get getResponseStatus(): ResponseStatus {
    return this.responseStatus;
  }

  get getException(): unknown {
    return this.exception;
  }
}
