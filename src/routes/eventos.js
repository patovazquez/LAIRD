var express = require('express');
var router = express.Router();
const path = require('path');
var multer  = require('multer');
var validations = require(path.join(__dirname,'..','middlewares','validaciones.js'));
var isLoged = require(path.join(__dirname,'..' ,'middlewares', 'isLoged.js'));

//Configuracion de multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/images/eventos'); 
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

var eventosController = require(path.join(__dirname,'..','controllers','eventosController'));



router.get('/', eventosController.index)
router.get('/register', eventosController.register)

/* rutas POST */
router.post('/register', upload.single('evento_img')/*,validations.register*/, eventosController.processRegister);


module.exports = router;