import { PartialType } from '@nestjs/mapped-types';
import { CreatePushDto } from './create-push.dto';

export class UpdatePushDto extends PartialType(CreatePushDto) {}
