StudentService = function(app) {
	this.studentDao = app.studentDao;
};
 
StudentService.prototype.findAll = function(callback) {
	this.studentDao.findAll(function(err, result) {
		callback(err, result);
	});
};

StudentService.prototype.findById = function(id, callback) {
	this.studentDao.findById(id, function(err, result) {
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

StudentService.prototype.delete = function(id, callback) {
	this.studentDao.delete(id, function(err, result) {
		callback(err, result);
	});
};
 
module.exports = StudentService;