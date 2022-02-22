import { Injectable, Logger } from '@nestjs/common';
import { UserCoupon } from '../../database/mysql/entities/user.coupon.entity';
import { UserService } from '../user/user.service';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { CouponType } from './enum/coupon.type';
import { CreateTaskPaymentReqDto } from './dto/create.task.payment.req.dto';
import { PaymentIntentRepository } from '../../database/mysql/repositories/payment.intent.repository';
import { PaymentIntent } from '../../database/mysql/entities/payment.intent.entity';
import { StripeWebhook } from '../../database/mysql/entities/stripe.webhook.entity';
import { StripeWebhookRepository } from '../../database/mysql/repositories/stripe.webhook.repository';
import { PaymentUtil } from '../../utils/payment/payment.util';
import { Task } from '../../database/mysql/entities/task.entity';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly userService: UserService,
    private readonly paymentIntentRepository: PaymentIntentRepository,
    private readonly stripeWebhookRepository: StripeWebhookRepository,
    private readonly paymentUtil: PaymentUtil,
    private readonly taskRepository: TaskRepository,
  ) {}

  private readonly logger = new Logger(PaymentService.name);

  create(createPaymentDto: CreateTaskPaymentReqDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async verifyUserCoupon(userUuid: string, userCouponUuid: string) {
    const userCoupon: UserCoupon = await this.userService.findActiveUserCoupon(
      userUuid,
      userCouponUuid,
    );
    if (userCoupon == null) {
      throw new ApiException(ResponseCode.STATUS_7002_INVALID_USER_COUPON);
    }
    this.logger.log('userCoupon:' + JSON.stringify(userCoupon));

    //todo: percentage coupon not yet supported
    if (userCoupon.coupon.type === CouponType.PERCENTAGE) {
      throw new ApiException(ResponseCode.STATUS_7002_INVALID_USER_COUPON);
    }

    // if (userCoupon.coupon.type === CouponType.PERCENTAGE) {
    //   if (
    //     totalChargeAmt -
    //       (totalChargeAmt * userCoupon.coupon.discountValue) / 100 !==
    //     finalChargeAmt
    //   ) {
    //     throw new ApiException(
    //       ResponseCode.STATUS_7003_INVALID_TOTAL_CHARGE_AMT,
    //     );
    //   }
    // }
    return userCoupon;
  }

  async savePaymentIntent(entity: PaymentIntent) {
    return await this.paymentIntentRepository.savePaymentIntent(entity);
  }

  async findOnePaymentIntentByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ) {
    return await this.paymentIntentRepository.findOnePaymentIntentByStripePaymentIntentIdAndIsDeletedFalse(
      stripePaymentIntentId,
    );
  }

  async saveStripeWebhook(entity: StripeWebhook) {
    return await this.stripeWebhookRepository.saveStripeWebhook(entity);
  }

  async captureFullPaymentOfMatchedTask(taskEntity: Task): Promise<Task> {
    const paymentIntent: PaymentIntent =
      await this.findOnePaymentIntentByStripePaymentIntentId(
        taskEntity.paymentIntentId,
      );
    if (paymentIntent == null) {
      this.logger.error(
        `paymentIntent not found for paymentIntentId: ${taskEntity.paymentIntentId}`,
      );
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    }
    const rsp = await this.paymentUtil.capturePaymentIntent(
      paymentIntent.stripePaymentIntentId,
      +paymentIntent.stripeAmountCapturable,
    );

    taskEntity.paymentStatus = rsp.status;
    taskEntity = await this.taskRepository.saveTask(taskEntity);

    return taskEntity;
  }

  async capturePartialPaymentOfCancelledTask(taskEntity: Task): Promise<Task> {
    const paymentIntent: PaymentIntent =
      await this.findOnePaymentIntentByStripePaymentIntentId(
        taskEntity.paymentIntentId,
      );
    if (paymentIntent == null) {
      this.logger.error(
        `paymentIntent not found for paymentIntentId: ${taskEntity.paymentIntentId}`,
      );
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    }
    await this.paymentUtil.capturePaymentIntent(
      paymentIntent.stripePaymentIntentId,
      taskEntity.serviceChargeAmt * 100,
    );
    const rsp = await this.paymentUtil.cancelPaymentIntent(
      paymentIntent.stripePaymentIntentId,
    );

    taskEntity.paymentStatus = rsp.status;
    taskEntity = await this.taskRepository.saveTask(taskEntity);

    return taskEntity;
  }

  async cancelPaymentWithoutCapture(taskEntity: Task): Promise<Task> {
    const paymentIntent: PaymentIntent =
      await this.findOnePaymentIntentByStripePaymentIntentId(
        taskEntity.paymentIntentId,
      );
    if (paymentIntent == null) {
      this.logger.error(
        `paymentIntent not found for paymentIntentId: ${taskEntity.paymentIntentId}`,
      );
      throw new ApiException(ResponseCode.STATUS_9999_SYSTEM_ERROR);
    }

    const rsp = await this.paymentUtil.cancelPaymentIntent(
      paymentIntent.stripePaymentIntentId,
    );

    taskEntity.paymentStatus = rsp.status;
    taskEntity = await this.taskRepository.saveTask(taskEntity);

    return taskEntity;
  }
}
