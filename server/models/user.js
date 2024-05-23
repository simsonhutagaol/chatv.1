'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `name cant empty`
        },
        notNull: {
          msg: `name cant null`
        },
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `The user already exists`
      },
      validate: {
        notEmpty: {
          msg: `email cant empty`
        },
        notNull: {
          msg: `email cant null`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `password cant empty`
        },
        notNull: {
          msg: `password cant null`
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};