'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN, DATE } = Sequelize;
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

      superadmin: {
        type: BOOLEAN,
        defaultValue: false,
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
  },

  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
