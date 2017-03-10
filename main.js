var port = 8081;
// var port = process.env.port || 1337;

var http = require('http');
var fs = require("fs");
var async = require('async');

var sysm = require('./proc_cpu');

function dateFormat (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

function proc_sysvipc(callback)
{
	console.log("proc_sysvipc ------------------------------>\n");
	var obj_ipc = {
		"ipc" : {
			msg : [{
				key: 0,
				msqid : 0,
				perms : 0,
				cbytes: 0,
				qnum : 0,
				pid : 0,
				lrpid : 0,
				stime: 0,
				rtime : 0,
				ctime: 0,
			},],
			sem : [{
				key : 0,
				semid: 0,
				perms: 0,
				nsems: 0,
			},],
			shm : [{
				key : 0,
				shmid : 0,
				perms : 0,
				size : 0,
				nattch : 0,
				uid : 0,
				gid : 0,
				cuid : 0,
				cgid : 0,
				atime: 0,
				dtime: 0,
				ctime: 0,
			},],
		},
    };
	
	console.log("sysvipc=" + JSON.stringify(obj_ipc) + "\n");
	console.log("<------------------------------ proc_sysvipc\n");
	callback(null, obj_ipc);
}

function server_accepted(req, res)
{
	console.log("Accepted...");

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.write('Hello World\n');

	var procs = [sysm.cpu, sysm.mem, proc_sysvipc, sysm.net];

	var dt_s = new Date().getTime();

	async.parallel(procs, 
		function(err, results) {
			var sysinfo = {};

			for( var opos=0; opos< results.length; opos++ ) {
				var obj = results[opos];
				var keys = Object.keys(obj);

				// console.log("obj:" + obj.toString());
				for( var kpos=0; kpos< keys.length; kpos++ ) {
					var kname = keys[kpos];

					// console.log("keys:" + kname.toString());
					// console.log("values:" + JSON.stringify(obj[kname]));

					sysinfo[kname] = obj[kname];
				}
			}

			var nowd = new Date();
			sysinfo["date"] = dateFormat(nowd, "%Y%m%d", false);
			sysinfo["time"] = dateFormat(nowd, "%H%M%S", false);

			var rtn = JSON.stringify(sysinfo);
			res.write(rtn);
		    res.end();

			console.log("#########################################\n");
			console.log("async" + rtn);
			console.log("#########################################\n");

			console.log('elapsed time : '+(nowd.getTime() - dt_s));
		}
	);
}

var server_main = http.createServer(server_accepted);
server_main.listen(port);
console.log("Server running at http://127.0.0.1:8081");
