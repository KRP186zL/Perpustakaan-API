const autoBind = require('auto-bind');

class AuthenticationHandler {
  #authenticationService;

  #usersService;

  #tokenManager;

  #validator;

  constructor(authenticationService, usersService, tokenManager, validator) {
    this.#authenticationService = authenticationService;
    this.#usersService = usersService;
    this.#tokenManager = tokenManager;
    this.#validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const validatedPayload = this.#validator.validatePostAuthenticationPayload(request.payload);

    const payloadToken = await this.#usersService.verifyUserCredential(validatedPayload);
    const accessToken = this.#tokenManager.generateAccessToken(payloadToken);
    const refreshToken = this.#tokenManager.generateRefreshToken(payloadToken);
    console.log(accessToken);
    console.log(refreshToken);

    await this.#authenticationService.postRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Login berhasil, authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);

    return response;
  }

  async putAuthenticationHandler(request, h) {
    const validatedPayload = this.#validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = validatedPayload;

    await this.#authenticationService.verifyRefreshToken(refreshToken);
    const payload = this.#tokenManager.verifyRefreshToken(refreshToken);

    const { userId, role } = payload;

    const accessToken = this.#tokenManager.generateAccessToken({ userId, role });

    const response = h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
    response.code(200);

    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const validatedPayload = this.#validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = validatedPayload;

    await this.#authenticationService.verifyRefreshToken(refreshToken);

    await this.#authenticationService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Refresh Token berhasil dihapus',
    });
    response.code(200);

    return response;
  }
}

module.exports = AuthenticationHandler;
