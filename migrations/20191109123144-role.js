'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, JSON: BDJSON, DATE } = Sequelize;
    await queryInterface.createTable('roles', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },

      name: {
        type: STRING(80),
        allowNull: false,
      },

      permission: {
        type: BDJSON,
      },

      // Timestamps
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('roles');
  },
};
