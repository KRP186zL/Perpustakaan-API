const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  email: Joi.string()
    .max(254)
    .email({ tlds: true })
    .empty('')
    .optional(),

  username: Joi.string()
    .max(25)
    .empty('')
    .optional(),

  password: Joi.string()
    .max(25)
    .empty('')
    .required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string()
    .empty('')
    .required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string()
    .empty('')
    .required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
