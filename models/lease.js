'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      lease.belongsTo(models.car,{
        foreignKey:'carId',
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      })
    }
  };
  lease.init({
    carId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    rate: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'lease',
  });
  return lease;
};