/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('transaksi_pinjam', {
    transaksi_id: {
      type: 'VARCHAR(26)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(21)',
      notNull: true,
      references: 'users(user_id)',
      onDelete: 'CASCADE',
    },
    buku_id: {
      type: 'VARCHAR(23)',
      notNull: true,
      references: 'buku(buku_id)',
      onDelete: 'CASCADE',
    },
    tanggal_pinjam: {
      type: 'DATE',
      notNull: true,
    },
    tanggal_kembali: {
      type: 'DATE',
    },
    status: {
      type: 'VARCHAR(12)',
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
  pgm.dropTable('transaksi_pinjam');
};
