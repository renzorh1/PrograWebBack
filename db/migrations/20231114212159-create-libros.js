'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('libros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      autor: {
        type: Sequelize.STRING
      },
      editorial: {
        type: Sequelize.STRING
      },
      categoria: {
        type: Sequelize.STRING
      },
      anio: {
        type: Sequelize.STRING
      },
      idioma: {
        type: Sequelize.STRING
      },
      isbn13: {
        type: Sequelize.STRING
      },
      imagen: {
        type: Sequelize.STRING
      },
      urlCompra: {
        type: Sequelize.STRING
      },
      reserva: {
        type: Sequelize.STRING
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('libros');
  }
};