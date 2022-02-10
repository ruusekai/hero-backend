export enum TaskPaymentStatus {
  PENDING = 'pending',
  REQUIRES_CAPTURE = 'requires_capture',
  SUCCEEDED = 'succeeded', //captured
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}
