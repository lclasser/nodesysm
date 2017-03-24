var mysql = require('mysql');

var ustd = require('./util_std');

console.log("=====> DB Connecting...");
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'nactor',
  password : 'a2017',
});
connection.query('use ndsysm');
console.log("=====> DB Connected...");

/* ************************************************************************************************
 * Memory
 ************************************************************************************************ */
module.exports.mem_insert = function(err, results) {
	var sql = 'INSERT INTO proc_mem(itime, total, free, avail, swap) VALUES (?,?,?,?,?)';
	
	var itime = ustd.dateFormat(new Date(), "%Y%m%d%H%M%S", false);

	var item = results;
	// console.log("Insert mem:" + JSON.stringify(item) + ":" + item.total);
	var val = [
		itime,
		item.total,
		item.free,
		item.available,
		item.swap,
	];
	connection.query(sql, val, function(err,row) {
		if( err != null ) {
			console.log('mem_insert err:', err);
		}
	});
}

module.exports.mem_min_select = function(cnt, callback) {
	var sql = "SELECT date_format(itime,'%H:%i:%s') as itime, ROUND(total/1000) as total, ROUND(free/1000) as free, ROUND(avail/1000) as avail, ROUND(swap/1000) as swap FROM proc_mem ORDER BY ino DESC LIMIT " + cnt;

	connection.query(sql, function(err, rows) {
		if( err != null ) {
			console.log('mem_min_select err:', err);
		} else {
			// console.log(rows);
			console.log("-------");

			var rst = [];
			for(var idx of rows) {
				rst.push(Object.assign({}, idx));
			}
			console.log(rst);
			// console.log("-------");
			callback(rst);
		}
	});
}

module.exports.mem_hour_select = function(cnt, callback) {
	var sql = "SELECT date_format(itime,'%H:%i:%s') as itime, ROUND(total/1000) as total, ROUND(free/1000) as free, ROUND(avail/1000) as avail, ROUND(swap/1000) as swap FROM proc_mem ORDER BY ino DESC LIMIT " + cnt;

	var sql = 
		"SELECT date_format(itime, '%Y%m%d%H') as hour, "
		+ "max(total) as total, "
	    + "max(free) as free1, min(free) as free2, "
	    + "max(swap) as swap1, min(swap) as swap2 "
		+ "FROM proc_mem "
		+ "GROUP BY hour "
		+ "ORDER BY hour desc "
	;

	connection.query(sql, function(err, rows) {
		if( err != null ) {
			console.log('mem_hour_select err:', err);
		} else {
			// console.log(rows);
			console.log("-------");

			var rst = [];
			for(var idx of rows) {
				rst.push(Object.assign({}, idx));
			}
			console.log(rst);
			// console.log("-------");
			callback(rst);
		}
	});
}

/* ************************************************************************************************
 * IPC-Queue
 ************************************************************************************************ */
module.exports.ipcq_insert = function(err, results) {
	var sql = 'INSERT INTO proc_ipcq(itime, qkey, msqid, perms, cbytes, qnum, lspid, lrpid, owner, stime, rtime, ctime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

	var itime = ustd.dateFormat(new Date(), "%Y%m%d%H%M%S", false);

	for( var rpos=0; rpos< results.length; rpos++ ) {
		var item = results[rpos];

		if( item.qnum > 0 ) {
			// console.log("Insert ipcq:" + item.key);
			var val = [
				itime,
				item.key,
				item.msqid,
				item.perms,
				item.cbytes,
				item.qnum,
				item.lspid,
				item.lrpid,
				item.owner,
				item.stime,
				item.rtime,
				item.ctime,
			];
			connection.query(sql, val, function(err,row) {
				if( err != null ) {
					console.log('ipcq_insert err:', err);
				}
			});
		}
	}
}

module.exports.tcp_insert = function(err, results) {
	var sql = 'INSERT INTO proc_tcp(itime, ntype, lip, lport, rip, rport, st, tx_queue, rx_queue) VALUES (?,?,?,?,?,?,?,?,?)';

	var itime = ustd.dateFormat(new Date(), "%Y%m%d%H%M%S", false);

	for( var rpos=0; rpos< results.length; rpos++ ) {
		var item = results[rpos];

		if( item.tx_queue > 0 || item.rx_queue > 0 ) {
			// console.log("Insert tcp:" + item.lip);
			var val = [
				itime,
				item.ntype,
				item.lip,
				item.lport,
				item.rip,
				item.rport,
				item.st,
				item.tx_queue,
				item.rx_queue,
			];
			connection.query(sql, val, function(err,row) {
				if( err != null ) {
					console.log('tcp_insert err:', err);
				}
			});
		}
	}
}

module.exports.udp_insert = function(err, results) {
	var sql = 'INSERT INTO proc_tcp(itime, ntype, lip, lport, rip, rport, st, tx_queue, rx_queue) VALUES (?,?,?,?,?,?,?,?,?)';

	var itime = ustd.dateFormat(new Date(), "%Y%m%d%H%M%S", false);

	for( var rpos=0; rpos< results.length; rpos++ ) {
		var item = results[rpos];

		if( item.tx_queue > 0 || item.rx_queue > 0 ) {
			// console.log("Insert tcp:" + item.lip);
			var val = [
				itime,
				item.ntype,
				item.lip,
				item.lport,
				item.rip,
				item.rport,
				item.st,
				item.tx_queue,
				item.rx_queue,
			];
			connection.query(sql, val, function(err,row) {
				if( err != null ) {
					console.log('tcp_insert err:', err);
				}
			});
		}
	}
}
