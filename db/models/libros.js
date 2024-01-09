'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class libros extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.reservas,{as:'reservas',foreignKey:'libroId'})
    }
  }
  libros.init({
    titulo: DataTypes.STRING,
    autor: DataTypes.STRING,
    editorial: DataTypes.STRING,
    categoria: DataTypes.STRING,
    anio: DataTypes.STRING,
    idioma: DataTypes.STRING,
    isbn13: DataTypes.STRING,
    imagen: DataTypes.STRING,
    urlCompra: DataTypes.STRING,
    reserva: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'libros',
  });
  return libros;
};