// Package
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

// Error
const InvariantError = require('../error/InvariantError');
const ClientError = require('../error/ClientError');
const NotFoundError = require('../error/NotFoundError');
const AuthenticationError = require('../error/AuthenticationError');
const AuthorizationError = require('../error/AuthorizationError');
const ConflictError = require('../error/ConflictError');

class UsersService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async verifyusername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) {
      throw new ConflictError(`username ${username} sudah digunakan`);
    }
  }

  async verifyEmail(email, userId = null) {
    const query = {
      text: 'SELECT user_id as "idUser", email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) {
      const { idUser } = result.rows[0];

      if (userId === idUser) {
        throw new ClientError(`Email ${email} sudah terdaftar diakun anda`);
      }
      throw new ConflictError(`Email ${email} sudah digunakan`);
    }
  }

  async verifyUserId(userId) {
    const query = {
      text: 'SELECT user_id FROM users WHERE user_id = $1',
      values: [userId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(`User dengan id ${userId} tidak ditemukan`);
    }
  }

  async authorizeUserAction({ userId, role }, targetId = null) {
    if (targetId) {
      await this.verifyUserId(targetId);
    }

    if (userId !== targetId && role !== 'admin') {
      throw new AuthorizationError('Anda tidak memiliki izin');
    }
  }

  async verifyUserCredential({ username, email, password }) {
    const query = {
      text: 'SELECT user_id as "userId", username, password, role FROM users WHERE username = $1 OR email = $2',
      values: [username, email],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Credential yang anda masukkan tidak valid');
    }
    const { password: hashingPassword } = result.rows[0];

    const verifyPassword = await bcrypt.compare(password, hashingPassword);

    if (!verifyPassword) {
      throw new AuthenticationError('Credential yang anda masukkan tidak valid');
    }
    const { userId, role } = result.rows[0];

    return {
      userId,
      role,
    };
  }

  async getRowsUsersTabel() {
    const query = 'SELECT user_id FROM users';

    const result = await this.#pool.query(query);

    return result.rowCount;
  }

  async postUser({ username, password, email }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 15);
    const role = !(await this.getRowsUsersTabel()) ? 'admin' : 'user';

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING user_id as "userId"',
      values: [id, username, hashedPassword, email, role],
    };

    await this.verifyusername(username);
    await this.verifyEmail(email);

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan users');
    }

    return result.rows[0].userId;
  }

  async getUsers() {
    const query = `SELECT users.user_id as "userId", users.username, users.email, user_details.nama
    FROM users
    LEFT JOIN user_details
    ON users.user_id = user_details.user_id
    WHERE users.role = 'user'`;

    const result = await this.#pool.query(query);

    return result.rows;
  }

  async putUserById(userId, { password, email }) {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 15);
    }
    const query = {
      text: `UPDATE users
      SET
      password = COALESCE($1, password), 
      email = COALESCE($2, email)
      WHERE user_id = $3
      RETURNING *`, // matikan returning dan ubah message
      values: [hashedPassword, email, userId],
    };

    await this.verifyEmail(email, userId);

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal update users');
    }

    return result.rows[0];
  }

  async deleteUserById(userId) {
    const query = {
      text: "DELETE FROM users WHERE user_id = $1 AND role != 'admin'",
      values: [userId],
    };

    const result = await this.#pool.query(query);
    if (!result.rowCount) {
      throw new ClientError('Administrator tidak dapat dihapus');
    }
  }

  // User Details
  async verifyNim(nim, userId) {
    const query = {
      text: 'SELECT nim, user_id as "idUser" FROM user_details WHERE nim = $1',
      values: [nim],
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) {
      const { idUser } = result.rows[0];
      if (userId === idUser) {
        throw new ClientError(`Nim ${nim} sudah terdaftar di akun anda`);
      }
      throw new ConflictError(`Nim ${nim} sudah digunakan`);
    }
  }

  async postUserDetails({
    userId,
    nim,
    nama,
    prodiId,
    fakultasId,
    tempatLahir,
    tanggalLahir,
  }) {
    const query = {
      text: 'INSERT INTO user_details VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id',
      values: [userId, nim, nama, prodiId, fakultasId, tempatLahir, tanggalLahir],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan detail user');
    }
  }

  async getUserDetailsById(userId) {
    const query = {
      text: `SELECT
      user_details.user_id as "userId",
      user_details.nim,
      user_details.nama,
      user_details.tempat_lahir as "tempatLahir",
      user_details.tanggal_lahir as "tanggalLahir",
      prodi.nama_prodi as "prodi",
      fakultas.nama_fakultas  as "fakultas"
      FROM user_details
      INNER JOIN prodi
      ON user_details.prodi_id = prodi.prodi_id
      INNER JOIN fakultas
      ON user_details.fakultas_id = fakultas.fakultas_id
      WHERE user_details.user_id = $1`,
      values: [userId],
    };

    const result = await this.#pool.query(query);
    return result.rows[0];
  }

  async putUserDetailsById(userId, {
    nim,
    nama,
    prodiId,
    fakultasId,
    tempatLahir,
    tanggalLahir,
  }) {
    const query = {
      text: `UPDATE user_details
      SET
      nim = COALESCE($1, nim),
      nama = COALESCE($2, nama),
      prodi_id = COALESCE($3, prodi_id),
      fakultas_id = COALESCE($4, fakultas_id),
      tempat_lahir = COALESCE($5, tempat_lahir),
      tanggal_lahir = COALESCE($6, tanggal_lahir)
      WHERE user_id = $7
      RETURNING *
      `, // matikan returning dan ubah message
      values: [nim, nama, prodiId, fakultasId, tempatLahir, tanggalLahir, userId],
    };

    await this.verifyNim(nim, userId);

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal update User Details');
    }

    return result.rows[0];
  }
}

module.exports = UsersService;
