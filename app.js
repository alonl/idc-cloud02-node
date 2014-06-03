
// dependencies
var express	= require('express')
  , http	= require('http')
  , path	= require('path');
  
var mysql	= require('mysql');
var ddb		= require('dynamodb');

var StudentController	= require('./application/StudentController');
var StudentService		= require('./business/StudentService');
var StudentDao			= require('./persistence/StudentDao');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//var connection = mysql.createConnection({
//	host     : 'students.cz3czispxv4v.us-east-1.rds.amazonaws.com',
//	user     : 'oded',
//	password : '12345678',
//	database : 'students'
//});
var connection = ddb.ddb({accessKeyId: 'AKIAIDYLS6A63C4NYKIA', secretAccessKey: '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'});

var a = {};
a.studentDao = new StudentDao(connection);
a.studentService = new StudentService(a);
a.studentController = new StudentController(a);

app.get('/students', a.studentController.findAll.bind(a.studentController));
app.get('/students/:id', a.studentController.findById.bind(a.studentController));
app.post('/students', a.studentController.insert.bind(a.studentController));
app.delete('/students/:id', a.studentController.delete.bind(a.studentController));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
