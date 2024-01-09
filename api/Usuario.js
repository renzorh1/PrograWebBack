const express = require('express');
const db = require('../db/models/index'); // Asegúrate de importar tu modelo User desde donde corresponda
const ruta = express.Router();


ruta.post('/verificarUsuario', async (req, res) => {
    try {
      const { usuario, contraseña } = req.body;
  
      // Buscar el usuario en la base de datos con carga de asociación
      const usuarioEncontrado = await db.usuarios.findOne({
        where: {
          correo: usuario,
          contrasena: contraseña,
        },
      });


      if (usuarioEncontrado) {
        // Usuario encontrado, devolver la información
        return res.status(200).json(usuarioEncontrado).end();
      } else {
        // Usuario no encontrado, devolver un error 401
        return res.status(401).end();
      }
    } catch (error) {
      console.error("Error en la verificación de credenciales:", error);
      return res.status(500).json({ error: "Hubo un error en el servidor." }).end();
    }
  });
  


ruta.post('/RegistrarUsuarios', async (req, res) => {
    try {
      const { nombre, apellido, documento, numero, correo, contrasena } = req.body;
  
      console.log(req.body);
      // Crear un nuevo usuario en la base de datos usando Sequelize
      const newUser = await db.usuarios.create({
        nombre,
        apellido,
        documento,
        numero,
        correo,
        contrasena,
        rol: 'alumno',
        foto: 'https://i.ytimg.com/vi/44WRauTPnlw/maxresdefault.jpg',
      });
  
      res.status(200).json({ success: true, message: 'Registro exitoso', data: newUser });
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  });



  ruta.get('/MostrarUsuariosDatos', async (req, res) => {
    try {
        // Aquí puedes agregar la lógica necesaria para obtener todos los usuarios de tu base de datos
        const usuarios = await db.usuarios.findAll({
            order: [['id', 'DESC']], // Ordena por id en orden descendente
        });

        // Mueve el usuario con id igual a 1 al principio del array
        const usuarioId1Index = usuarios.findIndex(usuario => usuario.id === 1);
        if (usuarioId1Index !== -1) {
            const usuarioId1 = usuarios.splice(usuarioId1Index, 1)[0];
            usuarios.unshift(usuarioId1);
        }

        // Devuelve los datos de los usuarios en la respuesta
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

ruta.get('/MostrarUsuariosDatos1', async (req, res) => {
  try {
      // Aquí puedes agregar la lógica necesaria para obtener todos los usuarios de tu base de datos
      const usuarios = await db.usuarios.findAll({
      });



      // Devuelve los datos de los usuarios en la respuesta
      res.status(200).json(usuarios);
  } catch (error) {
      console.error('Error en la solicitud GET:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

  ruta.post('/ActualizarUsuarioDatos', async (req, res) => {
    try {
      const { id, nombre, apellido, documento, numero } = req.body;
  
      // Verifica que todos los campos necesarios estén presentes
      if (!id || !nombre || !apellido || !documento || !numero) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }
  
      // Busca el usuario en la base de datos
      const usuario = await db.usuarios.findByPk(id);
  
      // Si no se encuentra el usuario, devuelve un error
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Actualiza la información del usuario
      usuario.nombre = nombre;
      usuario.apellido = apellido;
      usuario.documento = documento;
      usuario.numero = numero;
  
      // Guarda los cambios en la base de datos
      await usuario.save();
  
      // Responde con el usuario actualizado
      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });




  ruta.post('/EditarUsuariosCuenta', async (req, res) => {
    try {
      const { id, correo, contrasena } = req.body;
  
      // Verifica que todos los campos necesarios estén presentes
      if (!id || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }
  
      // Busca el usuario en la base de datos
      const usuario = await db.usuarios.findByPk(id);
  
      // Si no se encuentra el usuario, devuelve un error
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      // Actualiza la información del usuario
      usuario.correo = correo;
      usuario.contrasena = contrasena;
  
      // Guarda los cambios en la base de datos
      await usuario.save();
  
      // Responde con el usuario actualizado
      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

ruta.post('/ActualizarFotoUsuario', async (req, res) => {
  try {
    const { id, nuevaFotoUrl } = req.body;

    if (!id || !nuevaFotoUrl) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const usuario = await db.usuarios.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.foto = nuevaFotoUrl;

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});










module.exports = ruta;
