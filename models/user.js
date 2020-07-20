'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.car,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })
      user.hasMany(models.rent,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })
    }
  };
  user.init({
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    location: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    userImg: DataTypes.BLOB,
    password: DataTypes.STRING,
    isAdmin:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};