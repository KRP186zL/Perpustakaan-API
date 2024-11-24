/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('buku', {
    buku_id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    judul: {
      type: 'VARCHAR(150)',
      notNull: true,
      unique: true,
    },
    pengarang: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    halaman: {
      type: 'INTEGER',
      notNull: true,
    },
    penerbit: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    tahun_terbit: {
      type: 'DATE',
      notNull: true,
    },
    cover: {
      type: 'TEXT',
    },
    quantity: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('buku');
};
