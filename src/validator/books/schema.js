const Joi = require('joi');

const PostBookPayloadSchema = Joi.object({
  judul: Joi.string()
    .max(150)
    .empty('')
    .required(),

  pengarang: Joi.string()
    .max(100)
    .empty('')
    .required(),

  halaman: Joi.number()
    .empty(0)
    .required(),

  penerbit: Joi.string()
    .max(50)
    .empty('')
    .required(),

  tahunTerbit: Joi.date()
    .iso()
    .empty('')
    .required(),

  cover: Joi.string()
    .empty()
    .optional(),

  quantity: Joi.number()
    .empty(0)
    .required(),
});

const PutBookPayloadSchema = Joi.object({
  judul: Joi.string()
    .max(150)
    .empty('')
    .optional(),

  pengarang: Joi.string()
    .max(100)
    .empty('')
    .optional(),

  halaman: Joi.number()
    .empty(0)
    .optional(),

  penerbit: Joi.string()
    .max(50)
    .empty('')
    .optional(),

  tahunTerbit: Joi.date()
    .iso()
    .empty('')
    .optional(),

  cover: Joi.string()
    .empty()
    .optional(),

  quantity: Joi.number()
    .empty(0)
    .optional(),
});

module.exports = {
  PostBookPayloadSchema,
  PutBookPayloadSchema,
};
