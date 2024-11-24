const InvariantError = require('../../error/InvariantError');
const {
  PostBookPayloadSchema,
  PutBookPayloadSchema,
} = require('./schema');

const ValidatorBooksSchema = {
  validatePostBookPayload: (payload) => {
    const validationResult = PostBookPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },

  validatePutBookPayload: (payload) => {
    const validationResult = PutBookPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ValidatorBooksSchema;
