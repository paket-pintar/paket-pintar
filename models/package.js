'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Package.belongsTo(models.User)
    }
  };
  Package.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description cannot be empty!'
        },
        notNull: {
          args: true,
          msg: 'Description cannot be null!'
        }
      }
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Sender cannot be empty!'
        },
        notNull: {
          args: true,
          msg: 'Sender cannot be null!'
        }
      }
    },
    receiver: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Receiver cannot be empty!'
        },
        notNull: {
          args: true,
          msg: 'Receiver cannot be null!'
        }
      }
    },
    claimed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Claimed cannot be empty!'
        },
        notNull: {
          args: true,
          msg: 'Claimed cannot be null!'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};