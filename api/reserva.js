const express = require('express');
const router = express.Router();
const db = require('../db/models/index');
const { Op } = require("sequelize");


router.post('/reservar', async (req, res) => {
    try {
        const reservaData = req.body;

        // Crea una reserva en la base de datos
        const nuevaReserva = await db.reservas.create(reservaData);

        // Actualiza el campo 'estado' del libro a 'SiReservado'
        await db.libros.update({ reserva: 'SiReservado' }, {
            where: {
                id: reservaData.libroId // Asegúrate de que estás utilizando el nombre correcto del campo en tu modelo de libro
            }
        });

        res.status(200).json(nuevaReserva);
    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        res.status(500).json({ error: 'Error al procesar la reserva.' });
    }
});

router.get('/ultimasReservas', async (req, res) => {
    try {
      const { page } = req.query;
  
      // Validar y convertir la página a un número entero
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = 4;
      const start = (pageNumber - 1) * pageSize;
  
      // Consultar las últimas reservas desde la base de datos
      const reservas = await db.reservas.findAll({
        where: { estado: 'activo' },
        order: [['fechaReserva', 'DESC']],
        offset: start,
        limit: pageSize,    
        include: [
          {
            model: db.libros,
            as: 'libro', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['titulo','autor','anio','isbn13','imagen'], // Selecciona los campos que deseas obtener del libro
          },
          {
            model: db.usuarios,
            as: 'usuario', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['nombre', 'apellido'], // Selecciona los campos que deseas obtener del usuario
          },
        ],
        });
  
      // Calcular el total de páginas
      const totalItems = await db.reservas.count({ where: { estado: 'activo' } });
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Enviar la respuesta al cliente
      return res.status(200).json({
        page: pageNumber,
        totalPages,
        pageSize,
        totalItems,
        items: reservas,
      });
    } catch (error) {
      console.error('Error al cargar las últimas reservas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get('/ultimasReservasPorCodigo', async (req, res) => {
    try {
      const { page, codigoUsuario } = req.query;
  
      // Validar y convertir la página a un número entero
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = 4;
      const start = (pageNumber - 1) * pageSize;
  
      // Consultar las últimas reservas desde la base de datos
      const reservas = await db.reservas.findAll({
        where: { estado: 'activo', usuarioId: codigoUsuario },
        order: [['fechaReserva', 'DESC']],
        offset: start,
        limit: pageSize,    
        include: [
          {
            model: db.libros,
            as: 'libro', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['titulo','autor','anio','isbn13','imagen'], // Selecciona los campos que deseas obtener del libro
          },
          {
            model: db.usuarios,
            as: 'usuario', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['nombre', 'apellido'], // Selecciona los campos que deseas obtener del usuario
          },
        ],
        });
  
      // Calcular el total de páginas
      const totalItems = await db.reservas.count({
        where: {
          estado: 'activo',
          usuarioId: codigoUsuario, // Reemplaza tuCodigoDeUsuario con la variable que contenga el código de usuario deseado
        },
      });
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Enviar la respuesta al cliente
      return res.status(200).json({
        page: pageNumber,
        totalPages,
        pageSize,
        totalItems,
        items: reservas,
      });
    } catch (error) {
      console.error('Error al cargar las últimas reservas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get('/reservasProximasAVencer', async (req, res) => {
    try {
      const { page, codigoUsuario } = req.query;
  
      // Validar y convertir la página a un número entero
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = 4;
      const start = (pageNumber - 1) * pageSize;
  
      // Consultar las últimas reservas desde la base de datos
      const reservas = await db.reservas.findAll({
        where: { estado: 'activo', usuarioId: codigoUsuario },
        order: [['fechaVencimiento', 'ASC']],
        offset: start,
        limit: pageSize,    
        include: [
          {
            model: db.libros,
            as: 'libro', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['titulo','autor','anio','isbn13','imagen'], // Selecciona los campos que deseas obtener del libro
          },
          {
            model: db.usuarios,
            as: 'usuario', // Ajusta esto según la relación en tu modelo de reservas
            attributes: ['nombre', 'apellido'], // Selecciona los campos que deseas obtener del usuario
          },
        ],
        });
  
      // Calcular el total de páginas
      const totalItems = await db.reservas.count({
        where: {
          estado: 'activo',
          usuarioId: codigoUsuario, // Reemplaza tuCodigoDeUsuario con la variable que contenga el código de usuario deseado
        },
      });
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Enviar la respuesta al cliente
      return res.status(200).json({
        page: pageNumber,
        totalPages,
        pageSize,
        totalItems,
        items: reservas,
      });
    } catch (error) {
      console.error('Error al cargar las últimas reservas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get('/historicoReservas', async (req, res) => {
    try {
      const { page, codigoUsuario } = req.query;
  
      // Validar y convertir la página a un número entero
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = 3;
      const start = (pageNumber - 1) * pageSize;
  
      // Consultar las últimas reservas desde la base de datos
      const reservas = await db.reservas.findAndCountAll({
        where: { usuarioId: codigoUsuario },
        order: [['fechaVencimiento', 'ASC']],
        offset: start,
        limit: pageSize,
        include: [
          {
            model: db.libros,
            as: 'libro',
            attributes: ['titulo', 'autor', 'anio', 'isbn13', 'imagen'],
          },
          {
            model: db.usuarios,
            as: 'usuario',
            attributes: ['nombre', 'apellido'],
          },
        ],
      });
  
      // Extraer información de la consulta
      const { count: totalItems, rows: reservasItems } = reservas;
  
      // Calcular el total de páginas
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Enviar la respuesta al cliente
      return res.status(200).json({
        page: pageNumber,
        totalPages,
        pageSize,
        totalItems,
        items: reservasItems, // Cambiado de `reservas` a `reservasItems`
      });
    } catch (error) {
      console.error('Error al cargar las últimas reservas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

router.get('/masPedidos', async (req, res) => {
    try {
    const { page } = req.query;

    // Validar y convertir la página a un número entero
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = 4; // Ajusta según tus necesidades
    const start = (pageNumber - 1) * pageSize;

    // Consultar los más pedidos desde la base de datos
    const masPedidos = await db.reservas.findAll({
        attributes: [
          'libroId',
          [db.sequelize.fn('COUNT', 'libroId'), 'conteo'],
        ],
        offset: start,
        limit: pageSize,
        include: [
          {
            model: db.libros,
            attributes: ['titulo', 'autor', 'isbn13', 'imagen','anio'],
          },
        ],
        group: ['libroId', 'titulo', 'autor', 'isbn13', 'imagen','anio'],
        raw: true,
        order: [[db.sequelize.fn('COUNT', 'libroId'), 'DESC']],
      });
    console.log(masPedidos)
    // Calcular el total de páginas
    const totalItems = await db.reservas.count({
        distinct: true,
        col: 'libroId',
        include: [
          {
            model: db.libros,
            attributes: [],
          },
        ],
      });
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar la respuesta al cliente
    return res.status(200).json({
        page: pageNumber,
        totalPages,
        pageSize,
        totalItems,
        items: masPedidos,
    });
    } catch (error) {
    console.error('Error al cargar los más pedidos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener el detalle de la reserva por ID de libro
router.get('/detalleReserva', async (req, res) => {
  try {
    
    const libroId = req.query.libroId;
    console.log(libroId)

    // Realizar una consulta a la base de datos para obtener la reserva por ID del libro
    const reserva = await db.reservas.findOne({
      where: {
        libroId: libroId,
        estado: 'activo'
      },
      include: [{
        model: db.usuarios,
        attributes: ['nombre', 'apellido', 'correo'],
      }],
    });

    res.status(200).json(reserva);
  } catch (error) {
    console.error('Error al obtener el detalle de la reserva:', error);
    res.status(500).json({ mensaje: 'Error al obtener el detalle de la reserva.' });
  }
});

router.post('/eliminarReserva', async (req, res) => {
  console.log(req.query)
  try {
    const { reservaId, libroId } = req.body;
    console.log("ID RESERVAAAAAA" + reservaId)
    console.log("ID LIBROOOO" + libroId)

    // Realiza la lógica para cambiar el estado a "desactivado" en la tabla reserva
    const reservaUpdate = await db.reservas.update(
      { estado: 'desactivado' },
      { where: { id: reservaId} }
    );


    // Realiza la lógica para cambiar el estado a "NoReservado" en la tabla libros
    const libroUpdate = await db.libros.update(
      { reserva: 'NoReservado' },
      { where: { id: libroId } }
    );


    res.status(200).json({ mensaje: 'Reserva eliminada correctamente.' });
  } catch (error) {
    
  }
});

router.post('/validarFechaVencimiento', async (req, res) => {
  try {
    const { reservaId, libroId } = req.body;

    // Obtén la reserva por ID
    const reserva = await db.reservas.findOne({
      where: {
        id: reservaId,
        estado: 'activo'
      }
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }

    // Verifica la fecha de vencimiento
    const fechaVencimiento = new Date(reserva.fechaVencimiento);
    const fechaActual = new Date();

    if (fechaActual >= fechaVencimiento) {
      // La reserva está vencida, desactiva la reserva y actualiza el estado del libro
      await db.reservas.update(
        { estado: 'desactivado' },
        { where: { id: reservaId } }
      );

      await db.libros.update(
        { reserva: 'NoReservado' },
        { where: { id: libroId } }
      );

      return res.status(200).json({ mensaje: 'Reserva desactivada correctamente.' });
    } else {
      // La reserva no está vencida
      return res.status(200).json({ mensaje: 'La reserva no está vencida.' });
    }
  } catch (error) {
    console.error('Error al validar la fecha de vencimiento:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;