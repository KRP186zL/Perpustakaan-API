const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../error/InvariantError');
const ConflictError = require('../error/ConflictError');

class loansService {
  #pool;

  #booksService;

  constructor(booksService) {
    this.#pool = new Pool();
    this.#booksService = booksService;
  }

  async postJunction(userId, bukuId) {
    const query = {
      text: 'INSERT INTO buku_user VALUES ($1, $2) RETURNING user_id',
      values: [userId, bukuId],
    };

    await this.#pool.query(query);
  }

  async getJunction(userId, bukuId) {
    const query = {
      text: 'SELECT user_id, buku_id FROM buku_user WHERE user_id = $1 AND buku_id = $2',
      values: [userId, bukuId],
    };

    return (await this.#pool.query(query)).rowCount;
  }

  async deleteJunction(userId, bukuId) {
    const query = {
      text: 'DELETE FROM buku_user WHERE user_id = $1 AND buku_id = $2',
      values: [userId, bukuId],
    };

    await this.#pool.query(query);
  }

  async verifyBorrowBook(userId, bukuId) {
    const quantity = await this.#booksService.getQuantityBookById(bukuId);
    if (!quantity) {
      throw new ConflictError('Buku tidak dapat dipinjam');
    }

    const findBorrow = await this.getJunction(userId, bukuId);

    if (findBorrow) {
      throw new ConflictError('Anda tidak bisa meminjam buku yang sama sebelum dikembalikan');
    }
  }

  async postBorrowBook(userId, bukuId) {
    const id = `transaksi-${nanoid(16)}`;

    const tanggalPinjam = new Date().toISOString();
    const tanggalKembali = null;
    const status = 'dipinjam';

    const query = {
      text: 'INSERT INTO transaksi_pinjam VALUES ($1, $2, $3, $4, $5, $6) RETURNING transaksi_id AS "pinjamId"',
      values: [id, userId, bukuId, tanggalPinjam, tanggalKembali, status],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal pinjam buku');
    }

    return result.rows[0].pinjamId;
  }

  async getBorrows() {
    const query = {
      text: `SELECT bu.user_id AS "userId", bu.buku_id AS "bukuId", ud.nama AS "namaPeminjam", b.judul
      FROM buku_user bu
      LEFT JOIN user_details ud
      ON bu.user_id = ud.user_id
      LEFT JOIN buku b
      ON bu.buku_id = b.buku_id`,
    };

    const result = await this.#pool(query);

    return result.rows;
  }

  async putBorrowBook(transaksiId) {
    const tanggalKembali = new Date().toISOString();
    const query = {
      text: `UPDATE transaksi_pinjam
      SET
      tanggal_kembali = $1,
      status = 'dikembalikan
      WHERE transaksi_id = $2'
      RETURNING transaksi_id`,
      values: [tanggalKembali, transaksiId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal mengembalikan buku. Id transaksi tidak ditemukan');
    }
  }
}

module.exports = loansService;
