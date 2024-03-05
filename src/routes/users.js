var express = require('express');
var router = express.Router();
const path = require('path');
var multer  = require('multer');
var validations = require(path.join(__dirname,'..','middlewares','validacionesPatinador.js'));
var isLoged = require(path.join(__dirname,'..' ,'middlewares', 'isLoged.js'));

//Configuracion de multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/images/patinadores'); 
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



var usersController = require(path.join(__dirname,'..','controllers','usersController'));


/* GET todas las ligas */
router.get('/', usersController.index)
router.get('/register', usersController.register)
router.get('/login', usersController.login)
router.get('/detail/:patinadorId', usersController.detail); 
router.get('/mypanel', usersController.myPanel);
router.get('/integrar/:equipoId', isLoged.preventEditRoster, usersController.integrar); 
router.get('/edit/:id',isLoged.preventEditPatinador, usersController.edit);


/* rutas POST */
router.post('/register', upload.single('avatar_img'),validations.register,usersController.processRegister);
router.post('/',validations.login,usersController.processLogin);
router.post('/logout',usersController.logout);
router.post('/integrar',usersController.store);
router.post('/activarRoster/:rosterId', usersController.activarRoster);
router.post('/desactivarRoster/:rosterId', usersController.desactivarRoster);
router.delete('/delete/:rosterId/:equipoId'/*agregar midl para seguridad*/, usersController.destroyIntegrar); 
router.delete('/deleteEquipo/:patinadorEquipoId'/*agregar midl para seguridad*/, usersController.destroyEquipo); 
router.put('/edit/:id', upload.single('avatar_img'),validations.editPatinador, usersController.update);
router.post('/desactivar/:patinadorId', usersController.desactivar);
router.post('/activar/:patinadorId', usersController.activar);

module.exports = router;


 