'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      carId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'cars',
          key: 'id',
      },
      allowNull:false,
      },
      clientId: {
        type: Sequelize.INTEGER,
        references:{
            model: 'users',
            key: 'id',
        },
        allowNull:false,
    },
      durationHours: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 1 
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
    await queryInterface.dropTable('rents');
  }
};