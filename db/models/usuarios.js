'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.reservas, {foreignKey: 'usuarioId'})
    }
  }
  usuarios.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    documento: DataTypes.STRING,
    numero: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    foto: DataTypes.STRING,
    rol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuarios',
  });
  return usuarios;
};