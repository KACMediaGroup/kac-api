export default () => ({
  environment: process.env.NODE_ENV,
  port: +process.env.PORT,
  allowedCorsOrigins: process.env.ALLOWED_CORS_ORIGIN?.split(',') || [],
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      redirectUrl: process.env.KAKAO_REDIRECT_URL,
    },
    naver: {
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      redirectUrl: process.env.NAVER_REDIRECT_URL,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
    },
  },
  aligo: {
    apiKey: process.env.ALIGO_API_KEY,
    userId: process.env.ALIGO_USER_ID,
    senderKey: process.env.ALIGO_SENDER_KEY,
    senderNumber: process.env.ALIGO_SENDER_NUMBER,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  kacFe: {
    appHost: process.env.FRONT_KAC_APP_HOST,
    teacherHost: process.env.FRONT_KAC_TEACHERS_ROOM_HOST,
  },
})
