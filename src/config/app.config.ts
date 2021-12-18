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
});
