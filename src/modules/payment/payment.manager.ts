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
import { PaymentIntent } from '../../database/mysql/entities/payment.intent.entity';
import { StripeWebhook } from '../../database/mysql/entities/stripe.webhook.entity';
import { TaskRepository } from '../../database/mysql/repositories/task.repository';
import { UserCoupon } from '../../database/mysql/entities/user.coupon.entity';

@Injectable()
export class PaymentManager {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly paymentUtil: PaymentUtil,
    private readonly taskRepository: TaskRepository,
  ) {}

  private readonly logger = new Logger(PaymentManager.name);

  async create(
    bossUserUuid: string,
    taskUuid: string,
    createPaymentDto: CreateTaskPaymentReqDto,
  ): Promise<AppResponse> {
    const taskEntity: Task = await this.taskService.findOneTaskByUuid(taskUuid);
    const couponDiscountAmt = createPaymentDto.couponDiscountAmt;
    let effectiveCouponDiscountAmt: number = null;
    let calcFinalChargeAmt: number = null;

    if (
      taskEntity.paymentStatus === TaskPaymentStatus.SUCCEEDED ||
      taskEntity.paymentStatus === TaskPaymentStatus.REQUIRES_CAPTURE
    ) {
      throw new ApiException(ResponseCode.STATUS_7006_TASK_ALREADY_PAID);
    }

    //verify finalChargeAmt
    if (createPaymentDto.userCouponUuid != null) {
      //coupon can only use to reduce service charge
      if (couponDiscountAmt == null) {
        throw new ApiException(ResponseCode.STATUS_4004_BAD_REQUEST);
      }
      effectiveCouponDiscountAmt =
        Number(taskEntity.serviceChargeAmt) < Number(couponDiscountAmt)
          ? Number(taskEntity.serviceChargeAmt)
          : Number(couponDiscountAmt);
      calcFinalChargeAmt =
        Number(taskEntity.totalChargeAmt) - Number(effectiveCouponDiscountAmt);
      this.logger.log('newTotalAmt: ' + calcFinalChargeAmt);
      if (
        calcFinalChargeAmt.toFixed(2) !==
        createPaymentDto.finalChargeAmt.toFixed(2)
      ) {
        throw new ApiException(
          ResponseCode.STATUS_7003_INVALID_FINAL_CHARGE_AMT,
        );
      }
      await this.paymentService.verifyUserCoupon(
        bossUserUuid,
        createPaymentDto.userCouponUuid,
        createPaymentDto.couponDiscountAmt,
      );
    } else {
      if (
        Number(taskEntity.totalChargeAmt) !==
        Number(createPaymentDto.finalChargeAmt.toFixed(2))
      ) {
        throw new ApiException(
          ResponseCode.STATUS_7003_INVALID_FINAL_CHARGE_AMT,
        );
      }
      calcFinalChargeAmt = taskEntity.totalChargeAmt;
    }

    //check if the user already exist on stripe
    const user: User = await this.userService.findOneUserByUuid(bossUserUuid);
    let customerId: string = user.stripeCustomerId;
    if (user.stripeCustomerId == null) {
      const customer = await this.paymentUtil.createStripeCustomer(user);
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await this.userService.saveUser(user);
    }
    this.logger.log('calcFinalChargeAmt: ' + calcFinalChargeAmt);
    const paymentIntent =
      await this.paymentUtil.createStripePaymentIntentWithCreditHold(
        calcFinalChargeAmt,
        user.stripeCustomerId,
        user.uuid,
        taskEntity.uuid,
      );
    let paymentIntentEntity = new PaymentIntent();
    paymentIntentEntity.userUuid = user.uuid;
    paymentIntentEntity.stripeCustomerId = user.stripeCustomerId;
    paymentIntentEntity.stripePaymentIntentId = paymentIntent.id;
    paymentIntentEntity.taskUuid = taskEntity.uuid;
    paymentIntentEntity.userCouponUuid = user.uuid;
    paymentIntentEntity.couponDiscountAmt = couponDiscountAmt;
    paymentIntentEntity.effectiveCouponDiscountAmt = effectiveCouponDiscountAmt;
    paymentIntentEntity.totalChargeAmt = taskEntity.totalChargeAmt;
    paymentIntentEntity.finalChargeAmt = calcFinalChargeAmt;
    paymentIntentEntity.currency = taskEntity.category;
    paymentIntentEntity.stripePaymentMethodTypes = JSON.stringify(
      paymentIntent.payment_method_types,
    );
    paymentIntentEntity.stripeAmountCapturable =
      paymentIntent.amount_capturable;
    paymentIntentEntity.stripeAmountReceived = paymentIntent.amount_received;
    paymentIntentEntity.stripeCanceledAt = paymentIntent.canceled_at;
    paymentIntentEntity.stripeCancellationReason =
      paymentIntent.cancellation_reason;
    paymentIntentEntity.stripeStatus = paymentIntent.capture_method;

    paymentIntentEntity = await this.paymentService.savePaymentIntent(
      paymentIntentEntity,
    );

    return new AppResponse(paymentIntentEntity);
  }

  async stripeWebhook(webhookBody, sig) {
    const event = await this.paymentUtil.webhookConstructEvent(
      webhookBody,
      sig,
    );
    let paymentIntentId: string;
    if (event.type.includes('payment_intent')) {
      paymentIntentId = event.data.object.id;
    } else if (event.type.includes('charge')) {
      paymentIntentId = event.data.object.payment_intent;
    }
    this.logger.log(
      `paymentIntentId: ${paymentIntentId}, event.type: ${event.type}`,
    );

    if (paymentIntentId != null) {
      const stripeWebhook = new StripeWebhook();
      stripeWebhook.stripePaymentIntentId = paymentIntentId;
      stripeWebhook.webhook = JSON.stringify(event.data);
      await this.paymentService.saveStripeWebhook(stripeWebhook);

      if (event.type === 'charge.succeeded') {
        const chargeObject = event.data.object;
        this.logger.log('chargeObject: ' + JSON.stringify(chargeObject));

        //1. update paymentIntent
        const entity: PaymentIntent =
          await this.paymentService.findOnePaymentIntentByStripePaymentIntentId(
            chargeObject.payment_intent,
          );
        if (entity == null) {
          this.logger.error(
            `paymentIntent with id ${chargeObject.payment_intent} not found in db`,
          );
          throw new ApiException(
            ResponseCode.STATUS_7009_STRIPE_INVALID_WEBHOOK,
          );
        }
        const paymentIntentObject =
          await this.paymentUtil.retrievePaymentIntent(
            entity.stripePaymentIntentId,
          );
        entity.stripePaymentMethodTypes = JSON.stringify(
          paymentIntentObject.payment_method_types,
        );
        entity.stripeAmountCapturable = paymentIntentObject.amount_capturable;
        entity.stripeAmountReceived = paymentIntentObject.amount_received;
        entity.stripeCanceledAt = paymentIntentObject.canceled_at;
        entity.stripeCancellationReason =
          paymentIntentObject.cancellation_reason;
        entity.stripeStatus = paymentIntentObject.status;
        await this.paymentService.savePaymentIntent(entity);
        this.logger.log(
          `paymentIntent entity ${entity.stripePaymentIntentId} updated`,
        );

        //2. update task status
        const taskEntity: Task =
          await this.taskRepository.findOneTaskByUuidAndIsDeletedFalse(
            entity.taskUuid,
          );
        taskEntity.paymentStatus = TaskPaymentStatus.REQUIRES_CAPTURE;
        await this.taskRepository.saveTask(taskEntity);
        this.logger.log(`task entity ${taskEntity.uuid} updated`);

        //3. deactivate used coupon
        if (entity.userCouponUuid != null) {
          await this.userService.useUserCoupon(
            entity.userUuid,
            entity.userCouponUuid,
          );
        }
      } else {
        this.logger.log(
          `Unhandled event type ${event.type}, save webhook only`,
        );
      }
    } else {
      this.logger.error(
        `Unhandled event type ${event.type}, paymentIntentId NOT FOUND`,
      );
      this.logger.error(`webhook object: ${JSON.stringify(event.data)}`);
    }
    return;
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }
}
