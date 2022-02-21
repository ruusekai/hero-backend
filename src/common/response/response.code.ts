import { ResponseStatus } from './response.status';

export class ResponseCode {
  //success
  public static readonly STATUS_1000_SUCCESS = new ResponseStatus(
    1000,
    'Success',
    'Success',
  );

  //user error
  public static readonly STATUS_4001_EMAIL_ALREADY_USED = new ResponseStatus(
    4001,
    'User already exist for this email',
    'This email is already used by another account',
  );
  public static readonly STATUS_4002_MOBILE_ALREADY_USED = new ResponseStatus(
    4002,
    'User already exist for this mobile',
    'This mobile is already used by another account',
  );
  public static readonly STATUS_4003_USER_NOT_EXIST = new ResponseStatus(
    4003,
    'User Not Exist',
    'Oops! User Not Found',
  );
  public static readonly STATUS_4004_BAD_REQUEST = new ResponseStatus(
    4004,
    'Bad Request',
    'Oops! Please try again later',
  );
  public static readonly STATUS_4005_RESEND_SMS_REQUEST_TOO_OFTEN =
    new ResponseStatus(
      4005,
      'Resend sms request too frequent, please try again later',
      'You are resending too fast, please try again later',
    );
  public static readonly STATUS_4006_RESEND_SMS_REQUEST_EXCEED_LIMIT =
    new ResponseStatus(
      4006,
      'Resend Request exceed limit',
      'You have reached the maximum resend sms, please contact customer support',
    );
  public static readonly STATUS_4007_KYC_ALREADY_COMPLETED = new ResponseStatus(
    4007,
    'User already finished KYC',
    'You have already finished KYC',
  );
  public static readonly STATUS_4008_FORGET_PASSWORD_USER_NOT_FOUND =
    new ResponseStatus(
      4008,
      'Forget password user not found',
      'the email is not registered',
    );
  public static readonly STATUS_4009_FORGET_PASSWORD_REACHED_MAX_LIMIT =
    new ResponseStatus(
      4009,
      'Forget password reached max limit',
      'You have reached the maximum limit on requesting a password reset, please try again later',
    );
  public static readonly STATUS_4010_FORGET_PASSWORD_RESEND_TOO_OFTEN =
    new ResponseStatus(
      4010,
      'Forget password resend too often',
      'You resend request too often, please try again later',
    );
  public static readonly STATUS_4011_SMS_TOKEN_EXPIRED = new ResponseStatus(
    4011,
    'verification token of the user has expired',
    'Your sms token is expired, please try again',
  );
  public static readonly STATUS_4012_SMS_TOKEN_INVALID = new ResponseStatus(
    4012,
    'verification token of the user is invalid',
    'Your sms token is invalid, please try again',
  );
  public static readonly STATUS_4013_FORBIDDEN = new ResponseStatus(
    4013,
    'Forbidden',
    'User does not have the required permission(s).',
  );
  public static readonly STATUS_4014_UNAUTHORIZED = new ResponseStatus(
    4014,
    'Unauthorized',
    'User token unauthorized.',
  );
  public static readonly STATUS_4015_OAUTH_TOKEN_INVALID = new ResponseStatus(
    4015,
    'Oauth token invalid',
    'Oauth token invalid.',
  );
  public static readonly STATUS_4016_FACEBOOK_API_ERROR = new ResponseStatus(
    4016,
    'Facebook api error',
    'Facebook api error.',
  );

  //db error
  public static readonly STATUS_5001_DATABASE_ERROR = new ResponseStatus(
    5001,
    'Database Error',
    'Please try again later',
  );

  //file error
  public static readonly STATUS_6001_FILE_SERVICE_ERROR = new ResponseStatus(
    6001,
    'File service Error',
    'Please try again later',
  );

  //payment error
  public static readonly STATUS_7001_INVALID_TOTAL_CHARGE_AMT =
    new ResponseStatus(
      7001,
      'invalid total charge amt',
      'invalid total charge amt.',
    );

  public static readonly STATUS_7002_INVALID_USER_COUPON = new ResponseStatus(
    7002,
    'invalid user coupon',
    'invalid user coupon',
  );

  public static readonly STATUS_7003_INVALID_FINAL_CHARGE_AMT =
    new ResponseStatus(
      7003,
      'invalid final charge amt',
      'invalid final charge amt.',
    );

  public static readonly STATUS_7004_INVALID_HERO_REWARD_AMT =
    new ResponseStatus(
      7004,
      'hero的報酬不可低於任務成本的5%',
      'hero的報酬不可低於任務成本的5%',
    );
  public static readonly STATUS_7005_INVALID_CURRENT_LOCATION =
    new ResponseStatus(
      7005,
      'the lat/lon provided is invalid',
      'Please allow the app the access your current location to use this function',
    );

  public static readonly STATUS_7006_TASK_ALREADY_PAID = new ResponseStatus(
    7006,
    'the task is already paid',
    'the task is already paid',
  );

  public static readonly STATUS_7007_STRIPE_ERROR = new ResponseStatus(
    7007,
    'stripe error',
    'stripe error',
  );
  public static readonly STATUS_7008_INVALID_COUPON_DISCOUNT_AMT =
    new ResponseStatus(
      7008,
      'invalid coupon discount amt',
      'invalid coupon discount amt.',
    );
  public static readonly STATUS_7009_STRIPE_INVALID_WEBHOOK =
    new ResponseStatus(7009, 'invalid webhook', 'invalid webhook');

  public static readonly STATUS_7010_TASK_NOT_EXIST = new ResponseStatus(
    7010,
    'task not exists',
    'task not exists',
  );

  public static readonly STATUS_7011_MATCHED_TASK_CANNOT_BE_CANCELLED_BY_BOSS =
    new ResponseStatus(
      7011,
      'MATCHED_TASK_CANNOT_BE_CANCELLED_BY_BOSS',
      'task not exists',
    );

  //messaging
  public static readonly STATUS_8000_FIREBASE_ERROR = new ResponseStatus(
    8000,
    'firebase error',
    'firebase error',
  );

  public static readonly STATUS_8001_MESSAGE_GROUP_NOT_EXIST =
    new ResponseStatus(
      8001,
      'message group not exists',
      'message group not exists',
    );

  public static readonly STATUS_8002_MESSAGE_GROUP_NOT_ACTIVE =
    new ResponseStatus(
      8002,
      'message group not active',
      'message group not active',
    );

  public static readonly STATUS_8003_USER_NOT_IN_MESSAGE_GROUP =
    new ResponseStatus(
      8003,
      'user not in message group',
      'user not in message group',
    );

  public static readonly STATUS_8004_MESSAGE_CONTENT_INVALID =
    new ResponseStatus(
      8004,
      'message content invalid',
      'message content invalid',
    );

  public static readonly STATUS_8100_ONE_SIGNAL_ERROR = new ResponseStatus(
    8100,
    'one signal error',
    'one signal error',
  );

  //system error
  public static readonly STATUS_9999_SYSTEM_ERROR = new ResponseStatus(
    9999,
    'System Error',
    'Please try again later',
  );
}
