const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

//Configuracion de sequelize
const db = require(path.join('..','database','models'));
const { Op, where } = require("sequelize");

module.exports = {
    register: [
        

        body('name')
        .isLength({ min: 2 })
        .withMessage("El campo de nombre debe tener 2 caracteres como minimo"),   
        
        
        
        

       /* body('liga_img')
        .custom((value,{req}) => req.file) //Si no existe req.file la verificacion no va a pasar
        .withMessage("La imagen no es valida o no se ha elegido ninguna"),*/

        
       

    ],
   
    editEvento: [       

        body('name')
        .isLength({ min: 2 })
        .withMessage("El campo de nombre debe tener 2 caracteres como minimo"),
      
       
        
      

        body('liga_img'), /*en la validacion edit desactivo esta validacion para que quede guardada la imagen anterior*/
        //.custom((value,{req}) => req.file) //Si no existe req.file la verificacion no va a pasar
        //.withMessage("La imagen no es valida o no se ha elegido ninguna"),

        
        

    ],
 


}