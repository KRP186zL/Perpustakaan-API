const Jwt = require('@hapi/jwt');
const Config = require('../../utils/config');
const InvariantError = require('../error/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, Config.jwt.accessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, Config.jwt.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);

      Jwt.token.verifySignature(artifacts, Config.jwt.refreshTokenKey);

      const { payload } = artifacts.decoded;

      return payload;
    } catch {
      throw new InvariantError('Refresh Token tidak valid');
    }
  },
};

module.exports = TokenManager;
