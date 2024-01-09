const express = require('express');
const router = express.Router();
const db = require('../db/models/index');
const { Op } = require("sequelize");

router.get('/buscar', async (req, res) => { 

    // Obtener parametros de busqueda
    let {
        keyword = '',
        buscarPorTitulo = '',
        buscarPorISBN = '',
        buscarPorAutor = '',
        buscarPorSerie = '',
        page = '',
      } = req.query;

    let pageSize = 8
    // Necesito saber desde donde inicia la pagina y donde 
    let start = (page - 1) * pageSize // algoritmo para saber el punto de inicio
    let end = start + pageSize

    console.log(req.query)


    let libros = await db.libros.findAll({
        order: [['id', 'ASC']],
        where: {
          [Op.and]: {
            titulo: buscarPorTitulo === 'true' ? { [Op.iLike]: `%${keyword}%` } : { [Op.ne]: null },
            autor: buscarPorAutor === 'true' ? { [Op.iLike]: `%${keyword}%` } : { [Op.ne]: null },
            editorial: buscarPorSerie === 'true' ? { [Op.iLike]: `%${keyword}%` } : { [Op.ne]: null },
            isbn13: buscarPorISBN === 'true' ? { [Op.iLike]: `%${keyword}%` } : { [Op.ne]: null },
          },
        },
      });


    const totalItems = libros.length
    const totalPages = Math.ceil(totalItems / pageSize)
    let itemL = libros
    let itemsAPaginar = itemL.slice(start, end)
    // Convertir a JSON
    itemsAPaginar = JSON.stringify(itemsAPaginar)

    return res.status(200).json({
        page,
        totalPages,
        pageSize,
        totalItems,
        items: JSON.parse(itemsAPaginar)
    }
    )

});


router.get('/MostrarLibros', async (req, res) => {
  try {
    // Obtener todos los libros desde la base de datos
    const librosList = await db.libros.findAll();
    res.status(200).json(librosList);
  } catch (error) {
    console.error('Error en la solicitud GET:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.post('/AgregarLibro', async (req, res) => {
  try {
    const { titulo, autor, editorial, categoria, anio, idioma, isbn13, imagen, urlCompra} = req.body;

    console.log(req.body)

    const nuevoLibro = await db.libros.create({
      titulo,
      autor,
      editorial,
      categoria,
      anio,
      idioma,
      isbn13,
      imagen,
      urlCompra,
      reserva: 'NoReservado',
    });

    res.status(200).json({ success: true, message: 'Libro Guardado', data: nuevoLibro });
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
});


router.post('/EliminarLibro', async (req, res) => {
  try {
    const libroId = req.body.libroId;
    console.log(libroId)
    // Realiza la lógica de eliminación en la base de datos
    const resultado = await db.libros.destroy({
      where: {
        id: libroId,
      },
    });

    // Devuelve una respuesta exitosa
    res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    // Maneja los errores y devuelve una respuesta de error
    console.error('Error al eliminar el libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


module.exports = router;