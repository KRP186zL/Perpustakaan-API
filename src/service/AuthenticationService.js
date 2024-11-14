const { Pool } = require('pg');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');

class AuthenticationService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT token from authentications WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Refresh token tidak valid');
    }
  }

  async postRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1) RETURNING token',
      values: [token],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan Refresh Token');
    }
  }

  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this.#pool.query(query);
  }
}

module.exports = AuthenticationService;
