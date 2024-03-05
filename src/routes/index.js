var express = require('express');
var router = express.Router();
const path = require('path');
var indexController = require(path.join(__dirname,'..','controllers','indexController'));



/* GET home page. */
router.get('/', indexController.index)
router.get('/recursos', indexController.recursos)

module.exports = router;
