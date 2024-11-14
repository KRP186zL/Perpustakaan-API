/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('prodi', {
    prodi_id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    nama_prodi: {
      type: 'VARCHAR(24)',
      notNull: true,
      unique: true,
    },
  });

  const daftarProdi = [
    'Informatika',
    'Sistem Informasi',
    'Rekayasa Perangkat Lunak',
    'Akuntansi',
    'Management',
    'Magister Management',
    'Hukum',
    'Ilmu Perikanan',
    'Agroteknologi',
  ];

  daftarProdi.forEach((prodi) => {
    pgm.sql(`INSERT INTO prodi (nama_prodi) VALUES ('${prodi}')`);
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('prodi');
};
