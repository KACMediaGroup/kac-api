import * as Joi from 'joi'

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid('local', 'dev', 'qa', 'prod', 'test').default('local'),
    PORT: Joi.number().required(),
    ALLOWED_CORS_ORIGIN: Joi.string(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    KAKAO_CLIENT_ID: Joi.string().required(),
    KAKAO_CLIENT_SECRET: Joi.string().required(),
    KAKAO_REDIRECT_URL: Joi.string().required(),
    ALIGO_API_KEY: Joi.string().required(),
    ALIGO_USER_ID: Joi.string().required(),
    ALIGO_SENDER_KEY: Joi.string().required(),
    ALIGO_SENDER_NUMBER: Joi.string().required(),
    EMAIL_SERVICE: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    FRONT_KAC_APP_HOST: Joi.string().required(),
    FRONT_KAC_TEACHERS_ROOM_HOST: Joi.string().required(),
  })
}
