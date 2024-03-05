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

    try {
      const equipos = await db.Equipo.findAll({
        order: [['name', 'ASC']],
        include: [
          {
            model: db.Liga, // Nombre del modelo Liga
            as: 'Liga', // Alias para la relación (definido en el modelo de Evento)
            attributes: ['name'], // Columnas que deseas traer de la tabla Liga
            where: {
              condition: 'activa' // Agrega la condición para la columna 'condition' de la tabla Liga
            }
          }
        ]
      });

      res.render('allEquipos', { equipos: equipos });

    } catch (error) {
      res.send(error);
    }


  },
  search: async (req, res) => {
    try {

      let { equipo, province } = req.body;

      // Objeto where dinámico
      let whereClause = {};
      if (equipo) {
        whereClause.name = { [Op.like]: `%${equipo}%` };
      }
      if (province && province !== 'title') {
        whereClause.province = province;
      }
      let equipos = await db.Equipo.findAll({
        where: whereClause,

        include: [
          {
            model: db.Liga,
            as: 'Liga', // Alias para la relación (definido en el modelo de Evento)
            attributes: ['name'],
            where: {
              condition: 'activa'
            }
          }
        ],
        order: [
          ['province', 'ASC'],
          ['name', 'ASC']
        ]
      })
      console.log(req.body)
      res.render("equiposSearch", { equipos: equipos, province })
    } catch (error) {
      console.log(error)
    }
  },

  register: (req, res, next) => {

    res.render('equipoRegister');

  },

  processRegister: async (req, res, next) => {

    const errors = validationResult(req);
    //const defaultPoster = 'proximamente.jpg'; // Reemplaza el poster con la imagne prox

    // Verifica si req.file está definido
    //const logo = req.file ? req.file.filename : defaultPoster; 


    if (!errors.isEmpty()) {

      return res.render('equipoRegister', { errors: errors.array(), old: req.body })
    }
    try {
      await db.Equipo.create({

        created_by: req.session.ligaId,
        name: req.body.name,
        category: req.body.category,
        adress: req.body.adress,
        training_days: req.body.training_days,
        province: req.body.province,
        city: req.body.city,
        description: req.body.description,
        logo: req.file.filename,
        contact: req.body.contact,
        condition: "activo",
        link: req.body.link,

      });


    } catch (error) {
      res.send(error)

    }
    return res.redirect('/equipos');

  },

  destroy: async (req, res) => {
    let existingEquipo = await db.Equipo.findByPk(req.params.id);

    // Verifica si el equipo existe
    if (!existingEquipo) {
      res.status(404).send('Equipo no encontrado');
      return;
    }

    let imagePath = path.join(__dirname, '../../public/images/equipos/' + existingEquipo.logo);

    try {
      // Primero, eliminar todas las relaciones en la tabla intermedia
      await db.PatinadorEquipo.destroy({
        where: { equipoId: req.params.id }
      });

      // Ahora, eliminar el equipo
      await db.Equipo.destroy({ where: { id: req.params.id } });
      console.log(req.params.id);

      // Eliminar imagen si existe
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.redirect('/ligas/mypanel');
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error');
    }
  },

  edit: async (req, res) => {

    try {

      const unEquipo = await db.Equipo.findByPk(req.params.id, { include: { all: true } })


      res.render('equipoEdit', { unEquipo: unEquipo })


    } catch (error) {
      res.send(error);
    }
  },

  update: async (req, res) => {

    console.log("Body:", req.body);
    console.log("Params:", req.params);
    if (req.file) console.log("File:", req.file);

    const errors = validationResult(req);
    const unEquipo = await db.Equipo.findByPk(req.params.id);
    let imagePath = path.join(__dirname, '../../public/images/equipos/' + unEquipo.logo);

    if (!errors.isEmpty()) {

      let old = {
        ...req.body,
        id: req.params.id
      }
      return res.render('equipoEdit', { errors: errors.array(), unEquipo: old })
    } else {


      let editedEquipo = {
        ...req.body,
      }
      if (req.file) {
        editedEquipo.logo = req.file.filename;
        // Elimino imagen subida 
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }

      } else if (req.body.oldImage) {
        editedEquipo.logo = req.body.oldImage;
      }

      try {
        await db.Equipo.update(editedEquipo, { where: { id: req.params.id } })

      } catch (error) {
        res.send(error);
      }

      res.redirect('/ligas/mypanel');
    }
  },
  detail: async (req, res) => {

    let equipoId = (req.params.equipoId);

    try {

      const equipo = await db.Equipo.findOne({
        where: { id: equipoId },
        include: [
          {
            model: db.Liga,
            attributes: ['name'],
          },
        ],
      });

      const patinadoresEnEquipo = await db.Patinador.findAll({
        include: [{
          model: db.Equipo,
          as: 'Equipos',
          through: {
            model: db.PatinadorEquipo,
            as: 'patinadorEquipo',
            attributes: ['id', 'updated_at', 'roster'],
          },
          where: { id: equipoId },
          order: [
            // Ordena por la fecha de actualización en la tabla intermedia `PatinadorEquipo`
            [db.PatinadorEquipo, 'updated_at', 'DESC'],
          ]

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

      const patinadoresOrdenados = patinadoresFormateados.sort((a, b) => {
        // Primero, ordenar por roster (los que están en roster van primero)
        const rosterA = a.Equipos[0].patinadorEquipo.roster ? 1 : 0;
        const rosterB = b.Equipos[0].patinadorEquipo.roster ? 1 : 0;
        if (rosterB !== rosterA) {
          return rosterB - rosterA;
        }

        // Si ambos tienen el mismo estado de roster, ordenar por fecha (del más reciente al más antiguo)
        // Asegúrate de que las fechas estén en un formato comparable, como un objeto Date o un timestamp
        const fechaA = moment(a.Equipos[0].patinadorEquipo.updated_at, 'DD-MM-YYYY');
        const fechaB = moment(b.Equipos[0].patinadorEquipo.updated_at, 'DD-MM-YYYY');
        return fechaB.diff(fechaA); // moment.diff devuelve la diferencia en milisegundos (para ordenar del más nuevo al más viejo)
      });


      if (equipo == null) {
        res.send("404 not found")
      } else {
        res.render('equipoDetail', { equipo, patinadoresFormateados: patinadoresOrdenados, });
      }


    } catch (error) {
      console.error('Error al obtener el equipo con patinadores y liga:', error);
    }



    /*try {
      let unEquipo = await db.Equipo.findByPk(id);

      if (unEquipo == null) {
        res.send("404 not found")
      } else {
        res.render('equipoDetail', { unEquipo }); 
      }
      
    } catch (error) {
      res.send(error);
    }*/


  },

  /*
  

  
  */

}