import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';
import { PaymentUtilModule } from '../../utils/payment/payment.util.module';
import { MySqlRepositoryModule } from '../../database/mysql/repositories/mysql.repository.module';

@Module({
  imports: [UserModule, PaymentUtilModule, MySqlRepositoryModule],
  controllers: [PaymentController],
  providers: [PaymentManager, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
