export enum TaskPostStatus {
  //need to check task payment/approval status
  //even if it is available,
  // as it just refer to matching status
  //allow task match
  AVAILABLE = 'available',

  //not allow task match (match-matching status)
  MATCHED = 'matched',

  //not allow task match (match-matching status)
  BOSS_CANCELLED = 'boss_cancelled',
  EXPIRED = 'expired',
}
