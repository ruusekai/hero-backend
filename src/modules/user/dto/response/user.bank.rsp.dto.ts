import { AdminApprovalStatus } from '../../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../../common/enum/admin.decline.reason';
import { UserBank } from '../../../../database/mysql/entities/user.bank.entity';

export class UserBankRspDto {
  constructor(userBank: UserBank) {
    this.uuid = userBank?.uuid;
    this.userUuid = userBank?.userUuid;
    this.bankCode = userBank?.bankCode;
    this.bankNumber = userBank?.bankNumber;
    this.adminStatus = userBank?.adminStatus;
    this.declineReason = userBank?.declineReason;
    this.adminRemarks = userBank?.adminRemarks;
    this.createdDate = userBank?.createdDate;
    this.updatedDate = userBank?.updatedDate;
  }

  uuid: string;
  userUuid: string;
  bankCode: string;
  bankNumber: string;
  adminStatus: AdminApprovalStatus;
  declineReason: AdminDeclineReason;
  adminRemarks: string;
  createdDate: Date;
  updatedDate: Date;
}
