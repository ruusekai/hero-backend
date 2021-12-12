import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const RequiredHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const header = ctx.switchToHttp().getRequest().headers[value];
    if (!header) {
      throw new BadRequestException('Missing Header - ' + value);
    }
    return header;
  },
);
