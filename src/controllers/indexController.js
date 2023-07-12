const path = require('path');
const fs = require('fs');
const db = require(path.join('..','database','models'));
const { Op, where } = require('sequelize');

module.exports = {

    index: async (req, res, next) => {
    
        /*try{
            let ligas = await db.Liga.findAll();
            let eventos = await db.Eventos.findAll();
            //res.json(eventos);
            res.json(ligas);

        }catch(error){
            res.send(error);
        }*/
        res.render('index', { title: 'Express' });

    }

}