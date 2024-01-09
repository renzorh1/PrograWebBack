'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.libros,{foreignKey:'libroId'})
      this.belongsTo(models.usuarios,{foreignKey:'usuarioId'})
    }
  }
  reservas.init({
    fechaReserva: DataTypes.STRING,
    fechaVencimiento: DataTypes.STRING,
    estado: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'reservas',
  });
  return reservas;
};