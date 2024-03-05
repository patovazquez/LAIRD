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

      const noticias = await db.Noticia.findAll({
        
        order: [['updated_at', 'ASC']],
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


      res.render('allNoticias', { noticias: noticias });

    } catch (error) {
      res.send(error);
    }
},


  
}