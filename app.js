var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var membersRouter = require('./routes/members');
var sessionRouter = require('./routes/session');

var app = express();
var bodyParser = require('body-Parser');


//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//bodyParser

// session
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express(); 
app.use(cookieParser());
app.use(session({ secret: "123456",name:"session"}));
// 
// storage
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'foodtopia',
  port: 3306
});
var fs = require("fs");
var multer = require('multer');
var upload = multer({
  dest: './uploads'
});
app.post('/upload', upload.single('file'), function(req, res, next) {
   
  fs.rename(req.file.path, "./public/upload/" + req.file.originalname, function(err) {
      if (err) {
          throw err;
      }
      console.log('good!');
  })
  // res.writeHead(200, {
  //     "Access-Control-Allow-Origin": "*"
  // });
  // res.end(JSON.stringify(req.file)+JSON.stringify(req.body));
  req.session.profile = req.file.originalname;
  var _member = req.session.profile;
        console.log(_member);
        var id = req.session.sid;
        console.log(id);
        connection.query("update members set ? where sid=?", [{profile:_member}, id], function (error) {
            if (error) throw error;
            res.redirect('http://localhost:3001/memberCenter/basicInfo');
        });

})

// 

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', membersRouter);
app.use('/session', sessionRouter);




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
