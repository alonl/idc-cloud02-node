StudentService = function(app) {
	this.studentDao = app.studentDao;
};
 
StudentService.prototype.findAll = function(callback) {
	this.studentDao.findAll(function(err, result) {
		callback(err, result);
	});
};

StudentService.prototype.findByIndex = function(index, filter, callback) {
	this.studentDao.findByIndex(index, filter, function(err, result) {
		callback(err, result);
	});
};

StudentService.prototype.insert = function(student, callback) {
	this.studentDao.insert(student, function(err, result) {
		callback(err, result);
	});
};

StudentService.prototype.update = function(student, callback) {
	this.studentDao.update(student, function(err, result) {
		callback(err, result);
	});
};

StudentService.prototype.delete = function(id, creationDate, callback) {
	this.studentDao.delete(id, creationDate, function(err, result) {
		callback(err, result);
	});
};
 
module.exports = StudentService;