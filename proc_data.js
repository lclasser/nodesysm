var mysql = require('mysql');
var pdba = require('./proc_db');

module.exports.mem = function(callback) {
	var results = [];

	pdba.mem_select(60, function(rows) {
		console.log("data_mem...");
		console.log(rows);
		callback(null, rows);
	});
}
