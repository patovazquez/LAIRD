const path = require('path');
const fs = require('fs');
const db = require(path.join('..','database','models'));
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


module.exports = {

    index: async (req, res, next) => {
    
        try{
            let ventas = await db.Patinador.findAll();        
            
            res.json(ventas);

        }catch(error){
            res.send(error);
        }
        

    },
    /*register: (req, res, next) => {

        res.render('ligaRegister');
        
      },
      processRegister:async (req,res,next)=>{
      
        const errors = validationResult(req);
  
        if (!errors.isEmpty()) {
  
          return res.render('ligaRegister', {errors: errors.array(), old: req.body})
        } 
        try{
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
          
        }catch(error){
          res.send(error)
          console.log(error)
        }      
        return res.redirect('/');
        
      },*/

}