export default () => ({
  app: {
    name: 'Hero API',
    domain: process.env.DOMAIN,
    globalPrefix: 'hero-api',
    appPort: process.env.APP_PORT || 3000,
    paginateLimit: process.env.PAGINATE_LIMIT,
  },
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: '5m',
    headerJwtKey: 'hero-jwt',
    disableExpires: process.env.JWT_DISABLE_EXPIRATION_CHECKING || false,
  },
  user: {
    forgetPassword: {
      TOKEN_EXPIRY_TIME_IN_SECOND:
        process.env.TOKEN_EXPIRY_TIME_IN_SECOND || 86400,
      PASSWORD_RESET_RATE_LIMIT: process.env.PASSWORD_RESET_RATE_LIMIT || 5,
      PASSWORD_RESET_RATE_HOURS: process.env.PASSWORD_RESET_RATE_HOURS || 1,
      PASSWORD_RESET_TIME_INTERVAL:
        process.env.PASSWORD_RESET_TIME_INTERVAL || 60,
    },
    registration: {
      TOKEN_EXPIRY_TIME_IN_SECOND:
        process.env.TOKEN_EXPIRY_TIME_IN_SECOND || 86400,
      SMS_VERIFY_RESEND_TIME_INTERVAL_IN_SECOND:
        process.env.SMS_VERIFY_RESEND_TIME_INTERVAL_IN_SECOND || 60,
      SMS_VERIFY_RESEND_MAX_COUNT: process.env.SMS_VERIFY_RESEND_MAX_COUNT || 5,
    },
  },
  payment: {
    TASK_MINIMUM_CHARGE_AMT: process.env.PAYMENT_TASK_MINIMUM_CHARGE_AMT || 10,
    TASK_PLATFORM_CHARGE_PERCENTAGE:
      process.env.PAYMENT_TASK_PLATFORM_CHARGE_PERCENTAG || 5,
    TASK_MINIMUM_HERO_REWARD_PERCENTAGE:
      process.env.PAYMENT_TASK_MINIMUM_HERO_REWARD_PERCENTAGE || 5,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET,
  },
  sms: {
    twilio: {
      ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      API_KEY: process.env.TWILIO_API_KEY,
      API_SECRET: process.env.TWILIO_API_SECRET,
      MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID,
    },
  },
  google: {
    oauth: {
      CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
  },
  facebook: {
    oauth: {
      CLIENT_ID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      CLIENT_SECRET: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
    },
  },
  file: {
    THUMBNAIL_SIZE_PX: process.env.FILE_THUMBNAIL_SIZE_PX || 300,
  },
  message: {
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    CMS_MESSAGE_API_KEY: process.env.CMS_MESSAGE_API_KEY,
  },
  push: {
    ONE_SIGNAL_API_ENDPOINT: process.env.ONE_SIGNAL_API_ENDPOINT,
    ONE_SIGNAL_APP_ID: process.env.ONE_SIGNAL_APP_ID,
    ONE_SIGNAL_APP_KEY: process.env.ONE_SIGNAL_APP_KEY,
  },
  email: {
    POSTMARK_ENDPOINT: process.env.POSTMARK_ENDPOINT,
    POSTMARK_HEADER_SERVER_TOKEN: process.env.POSTMARK_HEADER_SERVER_TOKEN,
    SEND_FROM_EMAIL: process.env.SEND_FROM_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    CMS_ACTION_URL: process.env.EMAIL_CMS_ACTION_URL,
  },
});
