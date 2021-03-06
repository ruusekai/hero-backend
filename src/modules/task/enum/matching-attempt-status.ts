export enum TaskMatchingAttemptStatus {
  CREATED_MESSAGE_GROUP = 'created-message-group',

  //not allow task match (match-matching status)
  HERO_SEND_MATCHING = 'hero-send-matching', //等待boss接受
  BOSS_REJECT_MATCHING = 'boss-reject-matching', //已被boss拒絕- chatroom closed
  BOSS_MATCHED_WITH_OTHERS = 'boss-matched-with-others', //boss已與其他人配對
  BOSS_CANCEL_MATCHING = 'boss-cancel-matching', //任務已取消- chatroom closed

  BOSS_ACCEPT_MATCHING = 'boss-accept-matching', //任務已認投
  HERO_DONE_TASK = 'hero-done-task', //任務已完成

  BOSS_ACCEPT_DONE = 'boss-accept-done', //任務已確認- chatroom closed
  HERO_CANCEL_MESSAGE_GROUP = 'hero-cancel-message-group',
  HERO_CANCEL_MATCHING = 'hero-cancel-matching', //任務已取消- chatroom closed
  ABNORMAL = 'abnormal',
  // including hero cancelled/boss cancelled before match
}
