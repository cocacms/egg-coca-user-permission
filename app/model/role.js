'use strict';

module.exports = app => {
  const { STRING, JSON: BDJSON } = app.Sequelize;
  const Role = app.model.define('role', {
    name: {
      type: STRING(80),
      allowNull: false,
    },

    permission: {
      type: BDJSON,
    },
  });

  return Role;
};
