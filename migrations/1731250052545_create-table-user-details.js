/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('user_details', {
    user_id: {
      type: 'VARCHAR(21)',
      notNull: true,
      references: 'users(user_id)',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    nim: {
      type: 'INTEGER',
      notNull: true,
      unique: true,
    },
    nama: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    prodi_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'prodi(prodi_id)',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    fakultas_id: {
      type: 'INTEGER',
      notNull: true,
      references: 'fakultas(fakultas_id)',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    tempat_lahir: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    tanggal_lahir: {
      type: 'DATE',
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
  pgm.dropTable('user_details');
};
