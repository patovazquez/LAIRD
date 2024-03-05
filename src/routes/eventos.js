var express = require('express');
var router = express.Router();
const path = require('path');
var multer  = require('multer');
const validacionesEvento = require('../middlewares/validacionesEvento');
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
router.get('/edit/:id', isLoged.preventEditEvento, eventosController.edit);  
router.get('/detail/:eventoId', eventosController.detail); 

/* rutas POST */ 
router.post('/register', upload.single('evento_img'),validacionesEvento.register, eventosController.processRegister);
router.put('/edit/:id', upload.single('evento_img'),validacionesEvento.editEvento, eventosController.update);
router.delete('/delete/:id'/*agregar midl para seguridad*/, eventosController.destroy);  

module.exports = router;