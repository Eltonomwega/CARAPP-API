'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leases', {
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
      description: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 0 
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: true
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
    await queryInterface.dropTable('leases');
  }
};