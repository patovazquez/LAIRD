const path = require('path');
const fs = require('fs');
const db = require(path.join('..','database','models'));
const { Op, where } = require('sequelize');


module.exports = {

    index: async (req, res, next) => {
        
        let date = new Date();

        console.log("esta es la fecha"+ date)    
       
        res.render('index');

    },
    recursos: async (req, res, next) => {       

          
       
        res.render('recursos');

    },


}