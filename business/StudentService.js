StudentService = function(app) {
	this.studentDao = app.studentDao;
};
 
StudentService.prototype.findAll = function(callback) {
	this.studentDao.findAll(function(err, result) {
		callback(err, result);
	});
};
 
StudentService.prototype.getType = function() {
    return "author";
};
 
StudentService.prototype.getTemplate = function() {
    return "author.jade";
};
 
module.exports = StudentService;