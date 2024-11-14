const InvariantError = require('../../error/InvariantError');
const {
  PostUsersPayloadSchema,
  PutUsersPayloadSchema,
  PostUserDetailsPayloadSchema,
  PutUserDetailsPayloadSchema,
} = require('./schema');

const ValidatorUsers = {
  validatePostUsersPayload: (payload) => {
    const validationResult = PostUsersPayloadSchema.validate(payload);

    const { value, error } = validationResult;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validatePutUsersPayload: (payload) => {
    const resultValidation = PutUsersPayloadSchema.validate(payload);

    const { value, error } = resultValidation;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },

  // User Details
  validatePostUserDetailsPayload: (payload) => {
    const resultValidation = PostUserDetailsPayloadSchema.validate(payload);

    const { value, error } = resultValidation;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
  validatePutUserDetailsPayload: (payload) => {
    const resultValidation = PutUserDetailsPayloadSchema.validate(payload);

    const { value, error } = resultValidation;

    if (error) {
      throw new InvariantError(error.message);
    }

    return value;
  },
};

module.exports = ValidatorUsers;
