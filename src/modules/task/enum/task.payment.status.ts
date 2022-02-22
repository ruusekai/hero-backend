export enum TaskPaymentStatus {
  //allow task match
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CAPTURE = 'requires_capture',
  SUCCEEDED = 'succeeded', //captured

  //not allow task match
  PENDING = 'pending',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}
