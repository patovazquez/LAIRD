var express = require('express');
var router = express.Router();
const path = require('path');
var multer  = require('multer');
var validations = require(path.join(__dirname,'..','middlewares','validaciones.js'));
var isLoged = require(path.join(__dirname,'..' ,'middlewares', 'isLoged.js'));

//Configuracion de multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/images/ligas'); 
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



var ligasController = require(path.join(__dirname,'..','controllers','ligasController'));


/* GET todas las ligas */
router.get('/', ligasController.index)
router.get('/register', ligasController.register)
router.get('/login', ligasController.login);
router.get('/myPanel', ligasController.myPanel);
router.get('/edit/:id',isLoged.preventEditLiga, ligasController.edit);
router.get('/detail/:ligaId', ligasController.detail); 
router.get('/equipos/:ligaId', ligasController.equipos);  


/* rutas POST */
router.post('/register', upload.single('liga_img'),validations.register, ligasController.processRegister);
router.put('/edit/:id', upload.single('liga_img'),validations.editLiga, ligasController.update);
router.delete('/delete/:id'/*agregar midl para seguridad*/, ligasController.destroy);  
router.post('/',validations.login,ligasController.processLogin);
router.post('/logout',ligasController.logout);
router.post('/desactivar/:ligaId', ligasController.desactivar);
router.post('/activar/:ligaId', ligasController.activar);

module.exports = router;
 