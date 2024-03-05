const path = require('path');
const fs = require('fs');
const db = require(path.join('..', 'database', 'models'));
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fechaActual = new Date();
const moment = require('moment');

module.exports = {

  index: async (req, res, next) => {

    res.redirect('/');

  },

  detail: async (req, res) => {  

      if (req.session.patinadorId) {
  
        try {
  
          const patinadorConEquipos = await db.Patinador.findByPk(req.session.patinadorId, {
            include: [{
              model: db.Equipo,
              as: 'Equipos',
              through: {
                model: db.PatinadorEquipo,
                attributes: ['roster', 'id'], // Aquí puedes especificar los atributos de la tabla intermedia que te interesan, si no necesitas ninguno, déjalo como un array vacío
              },
              attributes: ['id', 'name']
            }],
            attributes: ['id', 'derby_name', 'number', 'avatar', 'condition','play', 'ref', 'coach','volun', 'pronoun','province']
          });
  
          if (patinadorConEquipos.Equipos && patinadorConEquipos.Equipos.length > 0) { /*eliminar pronto este log*/
            console.log(patinadorConEquipos.Equipos[0].dataValues);
          } else {
            console.log("El patinador no tiene equipos vinculados.");
          }
  
          res.render('patinadorDetail', { patinador: patinadorConEquipos })
  
        } catch (error) {
          res.send(error);
        }
      } else {
        return res.redirect('/users/login');
      }
  
    

  },

  register: (req, res, next) => {

    res.render('patinadorRegister');

  },
  processRegister: async (req, res, next) => {

    const errors = validationResult(req);

    const defaultAvatar = 'avatar.jpg'; // Reemplaza el AVATAR con la imagne prox

    const avatar = req.file ? req.file.filename : defaultAvatar;

    if (!errors.isEmpty()) {

      return res.render('patinadorRegister', { errors: errors.array(), old: req.body })
    }

    const play = req.body.play || "no";
    const ref = req.body.ref || "no";
    const coach = req.body.coach || "no";
    const volun= req.body.volun || "no";

    try {
      await db.Patinador.create({

        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        derby_name: req.body.derby_name,
        number: req.body.number,
        pronoun: req.body.pronoun,
        province: req.body.province,
        play: play,
        ref: ref,
        coach: coach,
        volun: volun,
        avatar: avatar,
        condition: "activa",
        permission: "patinador",

      });
      console.log(req.body)

    } catch (error) {
      res.send(error)
      console.log(error)
    }
    return res.redirect('/');

  },

  login: function (req, res, next) {

    res.render('patinadorLogin');

  },

  processLogin: async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('patinadorlogin', { error: true, old: req.body })
    } else {

      try {
        let patinadores = await db.Patinador.findAll();
        let patinadorLogin = patinadores.find(element => element.email === req.body.email);

        if (patinadorLogin && (bcrypt.compareSync(req.body.password, patinadorLogin.password))) {
          req.session.email = patinadorLogin.email;
          req.session.patinadorId = patinadorLogin.id;
          req.session.permiso = patinadorLogin.permission;
          req.session.ligaId = undefined;
          //req.session.image = userLogin.avatar;
          //req.session.tipe = userLogin.tipe;  /*si quiero darle permisos con el middleware de permision tipe para acceder a cosas */  


          res.redirect('/'); /*tengo que terminar la vista de MI panel para crear las otras cosas */
          //res.json(ligas)
          console.log(req.session.email, req.session.patinadorId, req.session.permiso, req.session.ligaId)
          //funcionando el session liga debe ser undefined para evitar usuarios logeados intervenir ligas
        }

        else {
          res.render('patinadorLogin', { error: true, old: req.body })
        }

      } catch (error) {
        res.send(error)
      }
    }

  },

  logout: (req, res) => {
    req.session.destroy();
    //res.clearCookie('rememberMe');
    //res.clearCookie('userId');

    res.redirect('/');
  },

  myPanel: async (req, res, next) => {


    if (req.session.patinadorId) {

      try {

        const patinadorConEquipos = await db.Patinador.findByPk(req.session.patinadorId, {
          include: [{
            model: db.Equipo,
            as: 'Equipos',
            through: {
              model: db.PatinadorEquipo,
              attributes: ['roster', 'id'], // Aquí puedes especificar los atributos de la tabla intermedia que te interesan, si no necesitas ninguno, déjalo como un array vacío
            },
            attributes: ['id', 'name']
          }],
          attributes: ['id', 'derby_name', 'number', 'avatar', 'condition']
        });

        if (patinadorConEquipos.Equipos && patinadorConEquipos.Equipos.length > 0) { /*eliminar pronto este log*/
          console.log(patinadorConEquipos.Equipos[0].dataValues);
        } else {
          console.log("El patinador no tiene equipos vinculados.");
        }

        res.render('myPanelPatinador', { patinador: patinadorConEquipos })

      } catch (error) {
        res.send(error);
      }
    } else {
      return res.redirect('/users/login');
    }

  },

  destroyEquipo: async (req, res) => {

    try {
      const patinadorId = req.session.patinadorId;
      const patinadorEquipoId = req.params.patinadorEquipoId;

      // Primero, verifica si el registro existe y pertenece al patinador en sesión
      const patinadorEquipo = await db.PatinadorEquipo.findOne({
        where: {
          id: patinadorEquipoId,
          patinadorId: patinadorId
        }
      });

      if (!patinadorEquipo) {
        // Si el registro no existe o no pertenece al patinador, devuelve un error
        return res.status(404).json({ success: false, message: 'Registro no encontrado o no tienes permiso para eliminarlo.' });
      }

      // Si el registro existe y pertenece al patinador, procede a eliminarlo
      await patinadorEquipo.destroy();

      res.redirect('/users/myPanel');
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al eliminar el vínculo' });
    }

  },


  edit: async (req, res) => {

    try {
      const unPatinador = await db.Patinador.findByPk(req.params.id)

      res.render('patinadorEdit', { unPatinador: unPatinador })

    } catch (error) {
      res.send(error);
    }
  },
  update: async (req, res) => {
    const errors = validationResult(req);
    const unPatinador = await db.Patinador.findByPk(req.params.id);
    let imagePath = path.join(__dirname, '../../public/images/patinadores/' + unPatinador.avatar);

    if (!errors.isEmpty()) {

      let old = {
        ...req.body,
        id: req.params.id
      }
      return res.render('patinadorEdit', { errors: errors.array(), unPatinador: old })
    } else {


      let editedPatinador = {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
        play: req.body.play || "no",
        ref: req.body.ref || "no",
        coach: req.body.coach || "no",
        volun: req.body.volun || "no",
      }
      if (req.file) {
        editedPatinador.avatar = req.file.filename;
        // Elimino imagen subida 
        if (fs.existsSync(imagePath) && path.basename(imagePath) !== "avatar.jpg") {
          fs.unlinkSync(imagePath)
        }


      } else if (req.body.oldImage) {
        editedPatinador.avatar = req.body.oldImage;
      }

      try {
        await db.Patinador.update(editedPatinador, { where: { id: req.params.id } })

      } catch (error) {
        res.send(error);
      }

      res.redirect('/users/mypanel');
    }
  },

  desactivar: async (req, res) => {
    try {
      const patinadorId = req.params.patinadorId;
      const nuevaCondicion = req.body.nuevaCondicion;

      await db.Patinador.update({ condition: nuevaCondicion }, {
        where: {
          id: patinadorId
        }
      });

      res.redirect(`/users/mypanel`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  },

  activar: async (req, res) => {
    try {
      const patinadorId = req.params.patinadorId;
      const nuevaCondicion = req.body.nuevaCondicion;

      await db.Patinador.update({ condition: nuevaCondicion }, {
        where: {
          id: patinadorId
        }
      });
      res.redirect(`/users/mypanel`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  },



  //CREAR ELIMINAR usuario


  /*---------------------------------controllers integracion de equipo y rosters------------------------------------------------*/


  integrar: async (req, res, next) => { // DEBERIA ACOTAR LOS DATOS A TRAER DE CADA CONSULTA! 
    try {
      let equipoId = req.params.equipoId;

      const patinadores = await db.Patinador.findAll();

      const equipo = await db.Equipo.findByPk(equipoId, {});

      const patinadoresEnEquipo = await db.Patinador.findAll({
        include: [{
          model: db.Equipo,
          as: 'Equipos',
          through: {
            model: db.PatinadorEquipo,
            as: 'patinadorEquipo',
            attributes: ['id', 'updated_at', 'roster'],
          },
          where: { id: equipoId }, // Filtrar por equipoId
        }]
      });

      // Mapear los patinadores para formatear la fecha
      const patinadoresFormateados = patinadoresEnEquipo.map(patinador => {
        const patinadorJson = patinador.toJSON(); // Convertir a un objeto simple si es necesario
        patinadorJson.Equipos.forEach(equipo => {
          // Verifica si existe 'patinadorEquipo' y 'updated_at' antes de intentar formatear
          if (equipo.patinadorEquipo && equipo.patinadorEquipo.updated_at) {
            // Formatear 'updated_at' usando Moment.js
            equipo.patinadorEquipo.updated_at = moment(equipo.patinadorEquipo.updated_at).format('DD-MM-YYYY');
          }
        });
        return patinadorJson;
      });

      // Ordenar patinadoresFormateados por 'roster' sin modificar el objeto final
      const patinadoresOrdenados = [...patinadoresFormateados].sort((a, b) => {
        const rosterA = a.Equipos[0].patinadorEquipo.roster ? 1 : 0;
        const rosterB = b.Equipos[0].patinadorEquipo.roster ? 1 : 0;

        return rosterB - rosterA; // Para ordenar primero true y después false
      });

      res.render("integrar", {
        patinadores: patinadores,
        equipo: equipo,
        patinadoresFormateados: patinadoresOrdenados, // Enviar patinadores ordenados
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error');
    }
  },

  store: async (req, res, next) => {
    try {
      // Obtener el ID del equipo y los IDs de los patinadores desde el formulario
      const equipoId = req.body.equipo; // Asegúrate de que el nombre del campo coincida con el nombre en el formulario
      let patinadorIds = req.body.patinador; // Esto debería ser un array de IDs

      // Asegurarse de que patinadorIds siempre sea un array
      if (!Array.isArray(patinadorIds)) {
        patinadorIds = [patinadorIds]; // Convertir a array si es string
      }


      // Encontrar el equipo por su ID
      const equipo = await db.Equipo.findByPk(equipoId);

      // Asegúrate de que tanto el equipo como los patinadores existan
      if (!equipo) {
        throw new Error('Equipo no encontrado');
      }

      // Crear las relaciones en la tabla patinador_equipo
      // Recorrer todos los IDs de los patinadores y añadirlos al equipo
      for (const patinadorId of patinadorIds) {
        // Verificar si ya existe la asociación
        const existeAsociacion = await db.PatinadorEquipo.findOne({
          where: {
            equipoId: equipoId,
            patinadorId: patinadorId
          }
        });

        // Si no existe, crear la nueva asociación
        if (!existeAsociacion) {
          await equipo.addPatinadores(patinadorId, {
            through: {
              roster: false
            }
          });
        }
      }

      // Redirigir a alguna ruta después de la operación
      res.redirect(`/users/integrar/${equipoId}`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error');
    }
  },

  activarRoster: async (req, res) => {
    try {

      const rosterId = req.params.rosterId;
      const { nuevaCondicion, equipoId } = req.body;

      await db.PatinadorEquipo.update({ roster: nuevaCondicion }, {
        where: {
          id: rosterId
        }
      });

      res.redirect(`/users/integrar/${equipoId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  },

  desactivarRoster: async (req, res) => {
    try {

      const rosterId = req.params.rosterId;
      const { nuevaCondicion, equipoId } = req.body;

      await db.PatinadorEquipo.update({ roster: nuevaCondicion }, {
        where: {
          id: rosterId
        }
      });

      res.redirect(`/users/integrar/${equipoId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  },

  destroyIntegrar: async (req, res) => {

    try {
      console.log("equipoId:", req.params.equipoId);
      const { rosterId, equipoId } = req.params;

      await db.PatinadorEquipo.destroy({
        where: { id: rosterId }
      });

      res.redirect(`/users/integrar/${equipoId}`);

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error aleliminar vinculo' });
    }
  },

  /*--------------------------------- FINAL controllers integracion de equipo y rosters---------------------------*/








}