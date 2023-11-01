const path = require('path');
const fs = require('fs');
const db = require(path.join('..', 'database', 'models'));
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


module.exports = {

  index: async (req, res, next) => {

    try {
      let ligas = await db.Liga.findAll({
        where: { condition: 'activa' }
      });

      res.render('allLigas', { ligas: ligas });

    } catch (error) {
      res.send(error);
    }


  },

  detail: async (req, res) => {
    let id = (req.params.ligaId);
    console.log(id)
    try {
      let unaLiga = await db.Liga.findByPk(id);

      if (unaLiga == null) {
        res.send("404 not found")
      } else {
        res.render('ligaDetail', { unaLiga });
      }
      //console.log(unaLiga)
    } catch (error) {
      res.send(error);
    }


  },

  register: (req, res, next) => {

    res.render('ligaRegister');

  },

  processRegister: async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      return res.render('ligaRegister', { errors: errors.array(), old: req.body })
    }
    try {
      await db.Liga.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        link_insta: req.body.link_insta,
        link_web: req.body.link_web,
        province: req.body.province,
        city: req.body.city,
        description: req.body.description,
        image: req.file.filename,
        tipe: req.body.tipe,
        condition: "activa",
        selection: "no",
        permission: "liga",
      });
      console.log(req.body)

      req.session.destroy(); //eliminar session si estaban logeados con otro liga y se registran

    } catch (error) {
      res.send(error)
      console.log(error)
    }
    return res.redirect('/ligas/login');

  },

  login: function (req, res, next) {

    res.render('ligaLogin');

  },

  processLogin: async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('ligalogin', { error: true, old: req.body })
    } else {

      try {
        let ligas = await db.Liga.findAll();
        let ligaLogin = ligas.find(element => element.email === req.body.email);

        if (ligaLogin && (bcrypt.compareSync(req.body.password, ligaLogin.password))) {
          req.session.email = ligaLogin.email;
          req.session.ligaId = ligaLogin.id;
          req.session.permiso = ligaLogin.permission;
          //req.session.image = userLogin.image;
          //req.session.tipe = userLogin.tipe;  /*si quiero darle permisos con el middleware de permision tipe para acceder a cosas */  


          res.redirect('/'); /*tengo que terminar la vista de MI panel para crear las otras cosas */
          //res.json(ligas)
          console.log(req.session.email, req.session.ligaId, req.session.permiso)//funcionando el session
        }

        else {
          res.render('ligaLogin', { error: true, old: req.body })
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

    if (req.session.ligaId) {
      try {
        let equipos = await db.Equipo.findAll({
          where: { created_by: req.session.ligaId },
          attributes: ['name', 'category', 'description']
        });

        let eventos = await db.Evento.findAll({
          where: { created_by: req.session.ligaId },
          attributes: ['id', 'name', 'created_by']
        });

        let liga = await db.Liga.findByPk(req.session.ligaId)

        res.render('myPanelLiga', { equipos: equipos, eventos: eventos, liga })
      } catch (error) {
        res.send(error);
      }
    } else {
      return res.redirect('/ligas/login');
    }
  },

  edit: async (req, res) => {

    try {
      const unaLiga = await db.Liga.findByPk(req.params.id)

      res.render('ligaEdit', { unaLiga: unaLiga })

    } catch (error) {
      res.send(error);
    }
  },

  update: async (req, res) => {
    const errors = validationResult(req);
    const unaLiga = await db.Liga.findByPk(req.params.id);
    let imagePath = path.join(__dirname, '../../public/images/ligas/' + unaLiga.image);

    if (!errors.isEmpty()) {

      let old = {
        ...req.body,
        id: req.params.id
      }
      return res.render('ligaEdit', { errors: errors.array(), unaLiga: old })
    } else {


      let editedLiga = {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
      }
      if (req.file) {
        editedLiga.image = req.file.filename;
        // Elimino imagen subida 
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }

      } else if (req.body.oldImage) {
        editedLiga.image = req.body.oldImage;
      }

      try {
        await db.Liga.update(editedLiga, { where: { id: req.params.id } })

      } catch (error) {
        res.send(error);
      }

      res.redirect('/ligas/mypanel');
    }
  },

  destroy: async (req, res) => {
    let existingLiga = await db.Liga.findByPk(req.params.id);
    let imagePath = path.join(__dirname, '../../public/images/ligas/' + existingLiga.image);

    try {
      await db.Liga.destroy({ where: { id: req.params.id, } })

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }


    } catch (error) {
      res.send(error);
    }

    req.session.destroy();
    //res.clearCookie('rememberMe');
    //res.clearCookie('userId');

    res.redirect('/');

  },
  desactivar: async (req, res) => {
    try {
      const ligaId = req.params.ligaId;
      const nuevaCondicion = req.body.nuevaCondicion;

      await db.Liga.update({ condition: nuevaCondicion }, {
        where: {
          id: ligaId
        }
      });

      res.redirect(`/ligas`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  },
  activar: async (req, res) => {
    try {
      const ligaId = req.params.ligaId;
      const nuevaCondicion = req.body.nuevaCondicion;

      await db.Liga.update({ condition: nuevaCondicion }, {
        where: {
          id: ligaId
        }
      });
      res.redirect(`/ligas`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar la condición' });
    }
  }




}








