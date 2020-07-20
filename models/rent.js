'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      rent.belongsTo(models.car,{
        foreignKey:'carId',
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      });

      rent.belongsTo(models.user,{
        foreignKey:'clientId',
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      })

    }
  };
  rent.init({
    carId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    durationHours: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'rent',
  });
  return rent;
};