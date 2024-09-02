import * as Joi from 'joi';

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
  });
}
