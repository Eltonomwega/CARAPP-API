'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      car.belongsTo(models.user,{
        foreignKey:'userId',
        onUpdate:'CASCADE'
      });

      car.hasMany(models.rent,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })

      car.hasOne(models.lease,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })
     
    }
  };
  car.init({
    carName: DataTypes.STRING,
    noPlate: DataTypes.STRING,
    description: DataTypes.STRING,
    mileage: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    carImg: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'car',
  });
  return car;
};