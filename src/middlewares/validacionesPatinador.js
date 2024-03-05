const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

//Configuracion de sequelize
const db = require(path.join('..','database','models'));
const { Op, where } = require("sequelize");

module.exports = {
    register: [
        body('email').custom(async (value) => {

            let user = (await db.Patinador.findOne({where: {email: value}}))
            if (user != null) {
                throw new Error('El email ingresado ya se encuentra registrado');
              }
              return true;
        }), 

        body('derby_name')
        .isLength({ min: 2 })
        .withMessage("El campo de nombre debe tener 2 caracteres como minimo"),        
        
        body('email')
        .isEmail()
        .withMessage("Ingrese un email valido"),
        
        body('password')
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener 8 caracteres como minimo"),

        /*body('avatar_img') AQUI LA IMAGEN ES OPCIONAL PARA LOS PATINADORES 
        .custom((value,{req}) => req.file) //Si no existe req.file la verificacion no va a pasar
        .withMessage("La imagen no es valida o no se ha elegido ninguna"),*/

        body('passwordCheck').
        custom((value,{req}) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
              }
              return true;
        })

    ],

    login:[

        body('email')
        .isEmail(),

        body('password')
        .isLength({ min: 8 })

    ],
    editPatinador: [       

        body('derby_name')
        .isLength({ min: 2 })
        .withMessage("El campo de nombre debe tener 2 caracteres como minimo"),
      
        body('email')
        .isEmail()
        .withMessage("Ingrese un email valido"),
        
        body('password')
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener 8 caracteres como minimo"),

        body('avatar_img'), /*en la validacion edit desactivo esta validacion para que quede guardada la imagen anterior*/
        //.custom((value,{req}) => req.file) //Si no existe req.file la verificacion no va a pasar
        //.withMessage("La imagen no es valida o no se ha elegido ninguna"),

        body('passwordCheck').
        custom((value,{req}) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
              }
              return true;
        })

    ],    


}