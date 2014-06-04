// TODO:
// sources:
// http://stackoverflow.com/questions/11835271/has-anyone-figured-out-how-to-scale-amazon-rds-read-replicas

// dependencies
var express	= require('express')
  , http	= require('http')
  , path	= require('path');

var CONFIG   = require('config');
var mysql	 = require('mysql');

var StudentController	= require('./application/StudentController');
var StudentService		= require('./business/StudentService');
var StudentDao			= require('./persistence/StudentDao');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon(path.join(__dirname, 'public', 'resources', 'images', 'favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var config = CONFIG;

var poolCluster = mysql.createPoolCluster();
poolCluster.add('MASTER', config.mysql.master);
poolCluster.add('READ', config.mysql.read);

var a = {};
a.studentDao = new StudentDao(config, poolCluster);
a.studentService = new StudentService(a);
a.studentController = new StudentController(a);

app.get('/students', a.studentController.findAll.bind(a.studentController));
app.post('/students', a.studentController.insert.bind(a.studentController));
app.put('/students', a.studentController.update.bind(a.studentController));
app.delete('/students/:id', a.studentController.delete.bind(a.studentController));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
