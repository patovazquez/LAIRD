var express = require('express');
var router = express.Router();
const path = require('path');
var multer  = require('multer');
const validacionesEquipo = require('../middlewares/validacionesEquipo');
var isLoged = require(path.join(__dirname,'..' ,'middlewares', 'isLoged.js'));

//Configuracion de multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/images/equipos'); 
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
    }
  })
   //Aca configuramos para que no acepte cualquier tipo de archvios y acepte solamente esas extensiones
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  }); 
//Fin de la configuracion de multer

var equiposController = require(path.join(__dirname,'..','controllers','equiposController'));



router.get('/', equiposController.index);
router.get('/register', equiposController.register);
router.post('/search', equiposController.search);
router.get('/edit/:id', isLoged.preventEditEquipo, equiposController.edit);  /*elpreventEditEvento funciona igual para el equipo*/
router.get('/detail/:equipoId', equiposController.detail); 

/* rutas POST */
router.post('/register', upload.single('equipo_img'),validacionesEquipo.register, equiposController.processRegister);
router.put('/edit/:id', upload.single('equipo_img'),validacionesEquipo.editEquipo, equiposController.update);
router.delete('/delete/:id'/*agregar midl para seguridad*/, equiposController.destroy);  

module.exports = router; 