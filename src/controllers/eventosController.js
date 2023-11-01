const path = require('path');
const fs = require('fs');
const db = require(path.join('..', 'database', 'models'));
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fechaActual = new Date();


module.exports = {

  index: async (req, res, next) => {

    try {

      const eventos = await db.Evento.findAll({
        where: {
          startdate: {
            [Op.gt]: fechaActual  // Utiliza el operador greater than (>) para comparar con la fecha actual
          }
        },
        order: [['startdate', 'ASC']],
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

      // Crear un objeto para agrupar los eventos por mes
      const eventosPorMes = {};

      // Definir el orden personalizado de los meses
      const ordenMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];


      // Iterar sobre la lista de eventos y agruparlos por mes
      eventos.forEach(evento => {
        const { month } = evento;


        if (!eventosPorMes[month]) {
          eventosPorMes[month] = [];
        }

        eventosPorMes[month].push(evento);
      });

      // Ordenar los meses según el orden personalizado
      //const mesesOrdenados = ordenMeses.filter(mes => eventosPorMes[mes]);

      // Asegurarte de que todos los meses estén presentes en mesesOrdenados
      const mesesOrdenados = ordenMeses.map(mes => ({
        nombre: mes,
        eventos: eventosPorMes[mes] || []
      }));


      res.render('allEventos', { mesesOrdenados: mesesOrdenados, eventosPorMes: eventosPorMes });

    } catch (error) {
      res.send(error);
    }


  },
  detail: async (req, res) => {
    let id = (req.params.eventoId);
    console.log(id)
    try {
      let unEvento = await db.Evento.findByPk(id);

      if (unEvento == null) {
        res.send("404 not found")
      } else {
        res.render('eventoDetail', { unEvento }); /*hacer esta vista!!!!!!!!!!!!!!!!!!!!!!!!!*/
      }
      //console.log(unaLiga)
    } catch (error) {
      res.send(error);
    }


  }, register: (req, res, next) => {

    res.render('eventoRegister');

  },

  processRegister: async (req, res, next) => {

    const errors = validationResult(req);
    const defaultPoster = 'proximamente.jpg'; // Reemplaza el poster con la imagne prox

    // Verifica si req.file está definido
    const poster = req.file ? req.file.filename : defaultPoster;


    if (!errors.isEmpty()) {

      return res.render('eventoRegister', { errors: errors.array(), old: req.body })
    }
    try {
      await db.Evento.create({

        created_by: req.session.ligaId,
        name: req.body.name,
        tipe: req.body.tipe,
        resume: req.body.resume,
        description: req.body.description,
        info: req.body.info,
        province: req.body.province,
        city: req.body.city,
        adress: req.body.adress,
        place: req.body.place,
        schedules: req.body.schedules,
        startdate: req.body.startdate,
        finishdate: req.body.finishdate,
        month: req.body.month,
        poster: poster,
        link_officiate: req.body.link_officiate,
        link_enroll: req.body.link_enroll,
        link_participate: req.body.link_participate,
        link_insta: req.body.link_insta,


      });
      console.log(req.body)

    } catch (error) {
      res.send(error)
      console.log(error)
    }
    return res.redirect('/eventos');

  },

  edit: async (req, res) => {

    try {
      
      const unEvento = await db.Evento.findByPk(req.params.id)

      res.render('eventoEdit', { unEvento: unEvento })

    } catch (error) {
      res.send(error);
    }
  },

  update: async (req, res) => {

    res.redirect('/ligas/mypanel');
    }


}