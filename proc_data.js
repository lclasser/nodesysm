var mysql = require('mysql');
var pdba = require('./proc_db');

module.exports.memm = function(callback) {
	var results = [];

	pdba.mem_min_select(60, function(rows) {
		console.log("data_mem...");
		console.log(rows);
		callback(null, rows);
	});
}

module.exports.memh = function(callback) {
	var results = [];

	pdba.mem_hour_select(60, function(rows) {
		console.log("data_mem...");
		console.log(rows);
		callback(null, rows);
	});
}
