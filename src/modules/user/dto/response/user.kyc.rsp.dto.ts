import { AdminApprovalStatus } from '../../../../common/enum/admin.approval.status';
import { AdminDeclineReason } from '../../../../common/enum/admin.decline.reason';

export class UserKycRspDto {
  constructor(newUserKyc) {
    this.uuid = newUserKyc?.uuid;
    this.userUuid = newUserKyc?.userUuid;
    this.adminStatus = newUserKyc?.adminStatus;
    this.declineReason = newUserKyc?.declineReason;
    this.adminRemarks = newUserKyc?.adminRemarks;
    this.createdDate = newUserKyc?.createdDate;
    this.updatedDate = newUserKyc?.updatedDate;
  }
  uuid: string;
  userUuid: string;
  adminStatus: AdminApprovalStatus;
  declineReason: AdminDeclineReason;
  adminRemarks: string;
  createdDate: Date;
  updatedDate: Date;
}
