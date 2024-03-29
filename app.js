var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var validator = require('express-validator');

var methodOverride = require('method-override');
var session = require('express-session');

var sessionData = require(path.join(__dirname, 'src/middlewares', 'sessionData.js'));

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var ligasRouter = require('./src/routes/ligas');
var eventosRouter = require('./src/routes/eventos');
var equiposRouter = require('./src/routes/equipos');
var oficialesRouter = require('./src/routes/oficiales');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');


//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'lairdApp',
  resave: true,
  saveUninitialized: true
}));

app.use(sessionData);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ligas', ligasRouter);
app.use('/eventos', eventosRouter);
app.use('/equipos', equiposRouter);
app.use('/oficiales', oficialesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
