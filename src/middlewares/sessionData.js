
 /*este middlawere almacena session para todo el proyecto*/


  module.exports = function sessionData (req, res, next) {

      res.locals.email = req.session.email;
      res.locals.id = req.session.LigaId; // Puedes agregar más datos según sea necesario
      res.locals.permiso = req.session.permiso;
      res.locals.patinadorId = req.session.patindorId;
      next();




  }