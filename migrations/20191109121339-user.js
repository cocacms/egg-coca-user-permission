'use strict';
const md5 = require('../app/util/md5');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },

      account: {
        type: STRING(80),
        allowNull: false,
      },

      password: {
        type: STRING(32),
        allowNull: false,
      },

      type: {
        type: ENUM('super', 'admin', 'normal'),
        allowNull: false,
        defaultValue: 'normal',
      },

      // Timestamps
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.addIndex('users', {
      name: 'account',
      fields: [ 'account' ],
      unique: true,
    });

    await queryInterface.bulkInsert('users', [
      {
        account: 'admin',
        password: md5(md5('admin') + 'admin'),
        type: 'super',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
