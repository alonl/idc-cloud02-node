//var createMySQLWrap = require('mysql-wrap');

StudentDao = function(connection) {
	//this.connection = createMySQLWrap(connection);
	this.connection = connection;
};

StudentDao.prototype.findAll = function(callback){
	//this.connection.select('students', {}, function(err, result) {
	//	if (err) callback(err)
	//	else callback(err, result.results);
	//});
	this.connection.getItem('students', '2', null, {}, function(err, res, cap) {
		callback(err, res);
	});
};

StudentDao.prototype.findById = function(req, res){
  //res.render('students', { title 'Express' });
};

StudentDao.prototype.insert = function(req, res){
  //res.render('students', { title 'Express' });
};

StudentDao.prototype.delete = function(req, res){
  //res.render('students', { title 'Express' });
};

module.exports = StudentDao;