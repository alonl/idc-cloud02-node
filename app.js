// dependencies
var express	= require('express')
  , http	= require('http')
  , path	= require('path');

var mysql	 = require('mysql');

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

var config = {
	mysql: {
		host     : 'localhost',
		port	 : '3306',
		user     : 'root',
		password : 'pass',
		database : 'cloud02'
	},
	awsCredentials: {
		key: "AKIAIZ3QW352K3U2APHQ",
		secret: "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"
	},
	awsS3Url: "https://s3.amazonaws.com/",
	awsS3Bucket: "cloud-02-students"
};

var connection = mysql.createConnection(config.mysql);

var a = {};
a.studentDao = new StudentDao(config, connection);
a.studentService = new StudentService(a);
a.studentController = new StudentController(a);

app.get('/students', a.studentController.findAll.bind(a.studentController));
app.get('/students/:id', a.studentController.findById.bind(a.studentController));
app.post('/students', a.studentController.insert.bind(a.studentController));
app.put('/students', a.studentController.update.bind(a.studentController));
app.delete('/students/:id', a.studentController.delete.bind(a.studentController));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
