function StudentController(app) {
	this.studentService = app.studentService;
};

StudentController.prototype.findAll = function findAll(req, res){
	this.studentService.findAll(function(err, result) {
		if (err) {
			res.send(500, err);
		} else {
			res.send(result);
		}
	});
};

StudentController.prototype.findById = function(req, res){
  //res.render('students', { title 'Express' });
};

StudentController.prototype.insert = function(req, res){
  //res.render('students', { title 'Express' });
};

StudentController.prototype.delete = function(req, res){
  //res.render('students', { title 'Express' });
};

module.exports = StudentController;