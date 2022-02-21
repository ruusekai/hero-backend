export enum TaskPaymentStatus {
  //allow task match
  REQUIRES_CAPTURE = 'requires_capture',
  SUCCEEDED = 'succeeded', //captured

  //not allow task match
  PENDING = 'pending',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}
