const autoBind = require('auto-bind');
const utils = require('../../utils');

class UsersHandler {
  #service;

  #validator;

  constructor(service, validator) {
    this.#service = service;
    this.#validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const payloadValidated = this.#validator.validatePostUsersPayload(request.payload);

    const userId = await this.#service.postUser(payloadValidated);

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler(request, h) {
    const { search = '' } = request.query;
    const credential = request.auth.credentials;

    await this.#service.authorizeUserAction(credential);
    const users = await this.#service.getUsers(search);

    const response = h.response({
      status: 'success',
      data: {
        users,
      },
    });
    response.code(200);

    return response;
  }

  async putUserByIdHandler(request, h) {
    const { id: userId } = request.params;
    const credential = request.auth.credentials;

    const payloadValidated = this.#validator.validatePutUsersPayload(request.payload);

    await this.#service.authorizeUserAction(credential, userId);
    const data = await this.#service.putUserById(userId, payloadValidated);

    const response = h.response({
      status: 'success',
      message: 'Berhasil update users',
      data,
    });
    response.code(200);

    return response;
  }

  async deleteUserByIdHandler(request, h) {
    const { id: userId } = request.params;
    const credential = request.auth.credentials;

    await this.#service.authorizeUserAction(credential, userId);
    await this.#service.deleteUserById(userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus users',
    });
    response.code(200);

    return response;
  }

  // User Details
  async postUserDetailsHandler(request, h) {
    const credential = request.auth.credentials;
    const { id: userId } = request.params;

    const formattedPayload = utils.formatUserDetailsPayload(request.payload);
    const payloadValidated = this.#validator.validatePostUserDetailsPayload(formattedPayload);

    await this.#service.authorizeUserAction(credential, userId);

    await this.#service.postUserDetails({ ...payloadValidated });

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkankan user details',
    });
    response.code(201);

    return response;
  }

  async getUserDetailsByIdHandler(request, h) {
    const { id: userId } = request.params;
    const credential = request.auth.credentials;

    await this.#service.authorizeUserAction(credential, userId);

    const user = await this.#service.getUserDetailsById(userId);

    const response = h.response({
      status: 'success',
      data: {
        user,
      },
    });
    response.code(200);

    return response;
  }

  async putUserDetailsByIdHandler(request, h) {
    const { id: userId } = request.params;
    const credential = request.auth.credentials;

    const formattedPayload = utils.formatUserDetailsPayload(request.payload);
    const payloadValidated = this.#validator.validatePutUserDetailsPayload(formattedPayload);

    await this.#service.authorizeUserAction(credential, userId);

    const user = await this.#service.putUserDetailsById(userId, { ...payloadValidated });

    const response = h.response({
      status: 'success',
      data: {
        user,
      },
    });
    response.code(200);

    return response;
  }
}

module.exports = UsersHandler;
