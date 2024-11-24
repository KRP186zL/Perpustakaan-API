const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');
const ClientError = require('../error/ClientError');

class BooksService {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async getQuantityBookById(bukuId) {
    const query = {
      text: 'SELECT quantity FROM buku WHERE buku_id = $1',
      values: [bukuId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Id buku tidak ditemukan');
    }

    return result.rows[0].quantity;
  }

  async putQuantityBookById(bukuId, quantity) {
    const query = {
      text: 'UPDATE buku SET quantity = $1 WHERE buku_id = $2',
      values: [quantity, bukuId],
    };

    await this.#pool.query(query);
  }

  async verifyJudul(judul) {
    const query = {
      text: 'SELECT judul FROM buku WHERE judul = $1',
      values: [judul],
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) {
      throw new ClientError('Judul buku sudah ada');
    }
  }

  async postBook({
    judul,
    pengarang,
    halaman,
    penerbit,
    tahunTerbit,
    cover,
    quantity,
  }) {
    const id = `buku-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO buku VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING buku_id as "id", judul',
      values: [id, judul, pengarang, halaman, penerbit, tahunTerbit, cover, quantity],
    };

    await this.verifyJudul(judul);
    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan buku');
    }

    return result.rows[0];
  }

  async getBooks(search) {
    const query = 'SELECT buku_id as "bukuId", judul, halaman, cover, quantity FROM buku WHERE judul ILIKE $1 OR pengarang ILIKE $1';

    const result = await this.#pool.query(query, [`%${search}%`]);

    return result.rows;
  }

  async getBookById(bukuId) {
    const query = {
      text: 'SELECT judul, pengarang, halaman, penerbit, tahun_terbit AS "tahunTerbit", cover, quantity FROM buku WHERE buku_id = $1',
      values: [bukuId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Id buku tidak ditemukan');
    }

    return result.rows[0];
  }

  async putBookById(bukuId, {
    judul,
    pengarang,
    halaman,
    penerbit,
    tahunTerbit,
    cover,
    quantity,
  }) {
    const query = {
      text: `UPDATE buku
      SET
      judul = COALESCE ($1, judul),
      pengarang = COALESCE ($2, pengarang),
      halaman = COALESCE ($3, halaman),
      penerbit = COALESCE ($4, penerbit),
      tahun_terbit = COALESCE ($5, tahun_terbit),
      cover = COALESCE ($6, cover),
      quantity = COALESCE ($7, quantity)
      WHERE buku_id = $8
      RETURNING *`, // matikan returning dan ubah message
      values: [judul, pengarang, halaman, penerbit, tahunTerbit, cover, quantity, bukuId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal mengubah buku.  Id buku tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteBookById(bukuId) {
    const query = {
      text: 'DELETE FROM buku WHERE buku_id = $1 RETURNING buku_id',
      values: [bukuId],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus buku. Id buku tidak ditemukan');
    }
  }
}

module.exports = BooksService;
