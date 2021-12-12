import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseStatus } from '../response/response.status';

export class ApiBadRequestException extends HttpException {
  private readonly responseStatus: ResponseStatus;
  private readonly exception: unknown;

  constructor(_responseStatus: ResponseStatus, exception?: unknown) {
    super(null, HttpStatus.BAD_REQUEST);
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
