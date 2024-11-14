/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('fakultas', {
    fakultas_id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    nama_fakultas: {
      type: 'VARCHAR(33)',
      notNull: true,
      unique: true,
    },
  });

  const daftarFakultas = [
    'ILMU TEKNIK',
    'ILMU EKONOMI DAN SOSIAL HUMANIORA',
    'ILMU PERIKANAN DAN HEWANI',
  ];

  daftarFakultas.forEach((fakultas) => {
    pgm.sql(`INSERT INTO fakultas (nama_fakultas) VALUES ('${fakultas}')`);
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('fakultas');
};
