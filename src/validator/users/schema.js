const Joi = require('joi');

const PostUsersPayloadSchema = Joi.object({
  username: Joi.string()
    .max(25)
    .empty('')
    .required(),

  password: Joi.string()
    .max(25)
    .empty('')
    .required(),

  email: Joi.string()
    .max(254)
    .email({ tlds: true })
    .empty('')
    .required(),
});

const PutUsersPayloadSchema = Joi.object({
  password: Joi.string()
    .max(25)
    .empty('')
    .optional(),

  email: Joi.string()
    .max(254)
    .email({ tlds: true })
    .empty('')
    .optional(),
});

// User Details
const PostUserDetailsPayloadSchema = Joi.object({
  userId: Joi.string()
    .max(21)
    .empty('')
    .required(),

  nim: Joi.number()
    .required(),

  nama: Joi.string()
    .max(100)
    .empty('')
    .required(),

  prodiId: Joi.number()
    .required(),

  fakultasId: Joi.number()
    .required(),

  tempatLahir: Joi.string()
    .max(100)
    .empty('')
    .required(),

  tanggalLahir: Joi.date()
    .iso()
    .required(),
});

const PutUserDetailsPayloadSchema = Joi.object({
  nim: Joi.number()
    .empty(0)
    .optional(),

  nama: Joi.string()
    .max(100)
    .empty('')
    .optional(),

  prodiId: Joi.number()
    .optional(),

  fakultasId: Joi.number()
    .optional(),

  tempatLahir: Joi.string()
    .max(100)
    .empty('')
    .optional(),

  tanggalLahir: Joi.date()
    .iso()
    .optional(),
});

module.exports = {
  PostUsersPayloadSchema,
  PutUsersPayloadSchema,
  PostUserDetailsPayloadSchema,
  PutUserDetailsPayloadSchema,
};
