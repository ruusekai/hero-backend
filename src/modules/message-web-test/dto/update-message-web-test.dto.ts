import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageWebTestDto } from './create-message-web-test.dto';

export class UpdateMessageWebTestDto extends PartialType(CreateMessageWebTestDto) {}
