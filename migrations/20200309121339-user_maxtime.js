'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    await queryInterface.addColumn('users', 'maxtime', {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'maxtime');
  },
};
