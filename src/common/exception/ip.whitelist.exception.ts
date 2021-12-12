import { ForbiddenException } from '@nestjs/common';

export class IpWhitelistException extends ForbiddenException {}
