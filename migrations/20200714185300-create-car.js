'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{
            model: 'users',
            key: 'id',
        }
      },
      carName: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      noPlate: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      mileage: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 0
      },
      carImg: {
        type: Sequelize.BLOB,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cars');
  }
};