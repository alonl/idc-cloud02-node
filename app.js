// TODO:
// sources:
// http://stackoverflow.com/questions/11835271/has-anyone-figured-out-how-to-scale-amazon-rds-read-replicas

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
		all01: {
			host     : 'cloud02.cmzgbq7rbnoh.us-east-1.rds.amazonaws.com',
			port	 : '3306',
			user     : 'root',
			password : 'passpass',
			database : 'cloud02'
		},
		read01: {
			host     : 'cloud02-1.cmzgbq7rbnoh.us-east-1.rds.amazonaws.com',
			port	 : '3306',
			user     : 'root',
			password : 'passpass',
			database : 'cloud02'
		}
	},
	awsCredentials: {
		key: "AKIAIJTWKLTPJQGTBP6Q",
		secret: "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"
	},
	awsS3Url: "https://s3.amazonaws.com/",
	awsS3Bucket: "cloud-02-students"
};

var poolCluster = mysql.createPoolCluster();
poolCluster.add('MASTER', config.mysql.all01);
poolCluster.add('READ', config.mysql.read01);

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
