import { Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { TaskMatchingAttemptManager } from './task-matching-attempt.manager';
import { MatchingAttemptAction } from '../common/enum/matching.attempt.action';

@Controller('task-matching-attempt')
export class TaskMatchingAttemptController {
  constructor(
    private readonly matchingAttemptManager: TaskMatchingAttemptManager,
  ) {}

  @Patch(':messageGroupId/:action')
  update(
    @Request() req,
    @Param('messageGroupId') messageGroupId: string,
    @Param('action') action: MatchingAttemptAction,
  ) {
    return this.matchingAttemptManager.update(
      messageGroupId,
      action,
      req.user.uuid,
    );
  }

  @Get(':messageGroupId')
  findOne(@Request() req, @Param('messageGroupId') messageGroupId: string) {
    return this.matchingAttemptManager.findOne(messageGroupId, req.user.uuid);
  }
}
