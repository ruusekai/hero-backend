import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../../common/response/response.code';
import { ApiException } from '../../../common/exception/api.exception';
import { UserCoupon } from '../entities/user.coupon.entity';

@EntityRepository(UserCoupon)
@Injectable()
export class UserCouponRepository extends Repository<UserCoupon> {
  constructor() {
    super();
  }

  async findUserCouponByOptionsOrderByStatusAscAndUpdatedDateDesc(
    options: any,
  ): Promise<UserCoupon[]> {
    try {
      options.isDeleted = false;
      return await this.find({
        where: options,
        relations: ['coupon'],
        order: {
          status: 'ASC',
          updatedDate: 'DESC',
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async findOneUserCouponByCouponCode(couponCode: string): Promise<UserCoupon> {
    try {
      return await this.findOne({
        where: { couponCode: couponCode, isDeleted: false },
        relations: ['coupon'],
      });
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }

  async saveUserCoupon(UserCoupon: UserCoupon): Promise<UserCoupon> {
    try {
      UserCoupon.updatedDate = new Date(Date.now());
      return await this.save(UserCoupon);
    } catch (e) {
      console.log(JSON.stringify(e.stack));
      throw new ApiException(ResponseCode.STATUS_5001_DATABASE_ERROR, e);
    }
  }
}
