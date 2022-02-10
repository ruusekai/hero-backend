import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';
import { PaymentManager } from './payment.manager';
import { RequiredHeader } from '../../common/decorator/required.header.decorator';
import { Public } from '../../common/decorator/public.endpoint.decorator';

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

  @Public()
  @Post('webhook')
  stripeWebhook(@Body() body, @RequiredHeader('stripe-signature') sig) {
    return this.paymentManager.stripeWebhook(body, sig);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(+id);
  // }
}
