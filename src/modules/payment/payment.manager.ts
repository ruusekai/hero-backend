import { Injectable, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';
import { AppResponse } from '../../common/response/app.response';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { TaskService } from '../task/task.service';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskPaymentStatus } from '../task/enum/task.payment.status';
import { UserService } from '../user/user.service';
import { User } from '../../database/mysql/entities/user.entity';
import { PaymentUtil } from '../../utils/payment/payment.util';

@Injectable()
export class PaymentManager {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly paymentUtil: PaymentUtil,
  ) {}

  private readonly logger = new Logger(PaymentManager.name);

  async create(
    bossUserUuid: string,
    taskUuid: string,
    createPaymentDto: CreateTaskPaymentReqDto,
  ): Promise<AppResponse> {
    const taskEntity: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    if (taskEntity.paymentStatus === TaskPaymentStatus.SUCCESS) {
      throw new ApiException(ResponseCode.STATUS_7004_TASK_ALREADY_PAID);
    }
    this.logger.log('totalChargeAmt: ' + taskEntity.totalChargeAmt);

    //verify finalChargeAmt
    if (createPaymentDto.userCouponUuid != null) {
      if (
        Number(
          (
            taskEntity.totalChargeAmt - createPaymentDto.couponDiscountAmt
          ).toFixed(2),
        ) !== Number(createPaymentDto.finalChargeAmt.toFixed(2))
      )
        await this.paymentService.verifyUserCoupon(
          bossUserUuid,
          createPaymentDto.userCouponUuid,
          createPaymentDto.couponDiscountAmt,
          taskEntity.totalChargeAmt,
          createPaymentDto.finalChargeAmt,
        );
    } else {
      if (
        Number(taskEntity.totalChargeAmt) !==
        Number(createPaymentDto.finalChargeAmt.toFixed(2))
      ) {
        throw new ApiException(
          ResponseCode.STATUS_7003_INVALID_TOTAL_CHARGE_AMT,
        );
      }
    }

    //check if the user already exist on stripe
    const user: User = await this.userService.findOneUserByUuid(bossUserUuid);
    let customerId: string = user.stripeCustomerId;
    if (user.stripeCustomerId == null) {
      const customer = await this.paymentUtil.createCustomer();
      customerId = customer.id;
    }
    return new AppResponse(customerId);
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }
}
