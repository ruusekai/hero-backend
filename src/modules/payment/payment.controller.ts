import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';
import { PaymentManager } from './payment.manager';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentManager: PaymentManager) {}

  @Post('task/:taskUuid')
  create(
    @Request() req,
    @Param('taskUuid') taskUuid: string,
    @Body() createTaskPaymentDto: CreateTaskPaymentReqDto,
  ) {
    return this.paymentManager.create(
      req.user.uuid,
      taskUuid,
      createTaskPaymentDto,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(+id);
  // }
}
