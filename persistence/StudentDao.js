var createMySQLWrap = require('mysql-wrap');
var S3Bucket        = require('ee-aws-s3-bucket');  
var mime            = require('mime');

StudentDao = function(config, poolCluster) {
	this.photosBucket = new S3Bucket({
		key: config.awsCredentials.key,
		secret: config.awsCredentials.secret,
		bucket: config.awsS3Bucket
	});
	this.awsS3Url = config.awsS3Url;
	
	// helper methods
	var me = this;
	this.uploadStudentPhoto = function(student, callback) {
		if (student.photo == undefined || student.photo.content == undefined) {
			callback(null);
			return;
		};
		var photoPath = "/photos/" + student.id + "." + mime.extension(student.photo.definition.type);
		this.photosBucket.put(photoPath, new Buffer(student.photo.content.substring(student.photo.content.indexOf(',') + 1), "base64"), student.photo.definition.type, function(err) {
			if (err) {
				callback(err);
				return;
			}
			student.photo = me.awsS3Url + photoPath;
			callback(err);
		}, {"CacheControl": "max-age=3600"}, false); // last argument indicates if it's private
	}
	this.getConnection = function(type, callback) {
		var cb = function(err, connection) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				console.log("Got connection: " + connection.config.host);
				callback(err, createMySQLWrap(connection));
			}
		};
		if      (type == 'WRITE') poolCluster.getConnection('MASTER', cb);
		else if (type == 'READ')  poolCluster.getConnection(cb);
	}
};

StudentDao.prototype.findAll = function(callback){
	this.getConnection('READ', function (err, connection) {
		if (err){
			callback(err)
		} else {
			connection.select('students', {}, function(err, result) {
				callback(err, result);
			});
		}
	});
};

StudentDao.prototype.insert = function(student, callback){
	var me = this;
	var uuid = guid();
	student.id = uuid;
	student.creationDate = new Date();
	this.uploadStudentPhoto(student, function(err) {
		me.getConnection('WRITE', function(err, connection) {
			if (err) {
				callback(err);
			} else {
				connection.insert('students', student, function(err, result) {
					callback(err, result);
				});
			}
		});
	});
};

StudentDao.prototype.update = function(student, callback){
	var me = this;
	this.uploadStudentPhoto(student, function(err) {
		me.getConnection('WRITE', function(err, connection) {
			if (err) {
				callback(err);
			} else {
			    delete student.creationDate;
				connection.update('students', student, {'id': student.id}, function(err, result) {
					callback(err, result);
				});
			}
		});
	});
};

StudentDao.prototype.delete = function(id, callback){
	this.getConnection('WRITE', function(err, connection) {
		if (err) {
			callback(err);
		} else {		
			connection.delete('students', {'id': id}, function(err, result) {
				callback(err, result);
			});
		}
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