'use strict';

module.exports = app => {
  const { STRING, ENUM, INTEGER } = app.Sequelize;

  const User = app.model.define(
    'user',
    {
      account: {
        type: STRING,
        allowNull: false,
      },

      password: {
        type: STRING(32),
        allowNull: false,
        set(val) {
          if (!val) {
            this.setDataValue('password', this.getDataValue('password'));
            return;
          }
          this.setDataValue(
            'password',
            app.signPassword(this.getDataValue('account'), val)
          );
        },
      },

      type: {
        type: ENUM('super', 'admin', 'normal'),
        allowNull: false,
        defaultValue: 'normal',
      },

      maxtime: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          name: 'account',
          fields: [ 'account' ],
          unique: true,
        },
      ],
    }
  );

  User.associate = function() {
    app.model.User.belongsToMany(app.model.Role, {
      through: 'user_role',
      as: 'roles',
    });
  };

  return User;
};
