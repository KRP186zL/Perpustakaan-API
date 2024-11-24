/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('buku_user', {
    user_id: {
      type: 'VARCHAR(23)',
      primaryKey: true,
      references: 'users(user_id)',
      onDelete: 'CASCADE',
    },
    buku_id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
      references: 'buku(buku_id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('buku_user');
};
