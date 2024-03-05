const path = require('path');

//Configuracion de sequelize
const db = require(path.join('..', 'database', 'models'));
const { Op, where } = require("sequelize");

module.exports = {


    preventEditLiga: (req, res, next) => {

        if (!req.session.email) {
            res.redirect('/');
        } else if (req.session.ligaId != req.params.id) {
            res.redirect('/');
        } else {
            next();
        }


    },

    preventEditEvento: async (req, res, next) => {

        let evento = (await db.Evento.findOne({ where: { id: req.params.id }, attributes: ['created_by'] }))

        if (!req.session.email) {
            res.redirect('/');
        } else if (req.session.ligaId != evento.created_by) {
            res.redirect('/');
        } else {
            next();
        }

    },

    preventEditRoster: async (req, res, next) => {

        let equipo = (await db.Equipo.findOne({ where: { id: req.params.equipoId }, attributes: ['created_by'] }))

        if (!req.session.email) {
            res.redirect('/');
        } else if (req.session.ligaId != equipo.created_by) {
            res.redirect('/');
        } else {
            next();
        }
    },

    preventEditPatinador: (req, res, next) => {

        if (!req.session.email) {
            res.redirect('/');
        } else if (req.session.patinadorId != req.params.id) {
            res.redirect('/');
        } else {
            next();
        }


    },
    preventEditEquipo: async (req, res, next) => {

        let equipo = (await db.Equipo.findOne({ where: { id: req.params.id }, attributes: ['created_by'] }))

        if (!req.session.email) {
            res.redirect('/');
        } else if (req.session.ligaId != equipo.created_by) {
            res.redirect('/');
        } else {
            next();
        }

    },


    // CREAR LOS PREVENT EDITAR EQUIPO EDITAR NOTICIAS  
}