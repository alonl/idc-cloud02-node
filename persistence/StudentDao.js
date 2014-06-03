var createMySQLWrap = require('mysql-wrap');
var S3Bucket        = require('ee-aws-s3-bucket');  

//conet S3_
//const S3_ENDPOINT = "https://cloud-02-students.s3-website-us-east-1.amazonaws.com";

StudentDao = function(connection, awsCredentials) {
	this.connection = createMySQLWrap(connection);
	this.photosBucket = new S3Bucket({
		key: awsCredentials.key,
		secret: awsCredentials.secret,
		bucket: "cloud-02-students"
	});
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
	var photoPath = "/photos/" + student.id;
	this.photosBucket.put(photoPath, student.photo.content, function(err) {
		if (err) {
			callback(err);
			return;
		}
		student.photo = student.photoPath;
		this.connection.insert('students', student, function(result, err) {
			callback(result, err);
		});
	}, student.photo.definition.type, undefined, false); // last argument indicates if it's private
	
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