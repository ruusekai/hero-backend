import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Scope,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ApiBadRequestException } from '../exception/api.bad.request.exception';
import { IpWhitelistException } from '../exception/ip.whitelist.exception';
import { ResponseCode } from '../response/response.code';
import { AppResponse } from '../response/app.response';
import { ApiException } from '../exception/api.exception';

@Catch()
@Injectable({ scope: Scope.REQUEST })
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status;
    let responseStatus;
    let data;

    if (
      exception instanceof ApiException ||
      exception instanceof ApiBadRequestException
    ) {
      status = exception.getStatus();
      responseStatus = exception.getResponseStatus;
      this.logger.error(
        'API Exception  : ' + responseStatus
          ? JSON.stringify(responseStatus)
          : null,
      );
    } else if (exception instanceof UnauthorizedException) {
      responseStatus = ResponseCode.STATUS_4014_UNAUTHORIZED;
      status = exception.getStatus();
    } else if (exception instanceof IpWhitelistException) {
      status = exception.getStatus();
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      this.logger.error('Http Exception  : ' + exception.message);
      if (status === HttpStatus.BAD_REQUEST) {
        responseStatus = ResponseCode.STATUS_4004_BAD_REQUEST;
        data = exception.getResponse();
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error('Exception', exception.stack);
    } else {
      this.logger.error('Unknown Exception');
    }

    response
      .status(status)
      .json(
        new AppResponse(
          data ?? null,
          responseStatus != null
            ? responseStatus
            : ResponseCode.STATUS_9999_SYSTEM_ERROR,
        ),
      );
  }
}
