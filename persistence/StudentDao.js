var createMySQLWrap = require('mysql-wrap');
var S3Bucket        = require('ee-aws-s3-bucket');  
var mime            = require('mime');

//conet S3_
//const S3_ENDPOINT = "https://cloud-02-students.s3-website-us-east-1.amazonaws.com";

StudentDao = function(config, connection) {
	this.connection = createMySQLWrap(connection);
	this.photosBucket = new S3Bucket({
		key: config.awsCredentials.key,
		secret: config.awsCredentials.secret,
		bucket: config.awsS3Bucket
	});
	this.awsS3Url = config.awsS3Url + config.awsS3Bucket;
};

StudentDao.prototype.findAll = function(callback){
	this.connection.select('students', {}, function(err, result) {
		callback(err, result);
	});
};

StudentDao.prototype.findById = function(id, callback){
  //res.render('students', { title 'Express' });
};

StudentDao.prototype.insert = function(student, callback){
	var me = this;
	var uuid = guid();
	student.id = uuid;
	var photoPath = "/photos/" + uuid + "." + mime.extension(student.photo.definition.type);
	this.photosBucket.put(photoPath, new Buffer(student.photo.content.substring(student.photo.content.indexOf(',') + 1), "base64"), student.photo.definition.type, function(err) {
		if (err) {
			console.log(err);
			callback(err);
			return;
		}
		student.photo = me.awsS3Url + photoPath;
		me.connection.insert('students', student, function(result, err) {
			callback(result, err);
		});
	}, undefined, false); // last argument indicates if it's public
	
};

StudentDao.prototype.update = function(student, callback){
	this.connection.update('students', student, {'id': student.id}, function(result, err) {
		callback(result, err);
	});
};

StudentDao.prototype.delete = function(id, callback){
	this.connection.delete('students', {'id': id}, function(result, err) {
		callback(result, err);
	});
};

module.exports = StudentDao;


// helper functions
// from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();