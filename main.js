var port = 8082;
// var port = process.env.port || 1337;

var fs = require("fs");
var http = require('http');
var async = require('async');
var url = require('url');
const cluster = require('cluster');

var psys = require('./proc_sys');
var pdat = require('./proc_data');
var push = require('./proc_push');
var ustd = require('./util_std');

function recv_after(req, res)
{
	console.log("####################################################################");
	console.log("Accepted...");

	var qtype = null;
	var qry = url.parse(req.url, '&');
	if( qry == null ) {
			res.write('Not found pages.');
			res.end();
	}

	qtype = qry.query['type'];

	/////////////////////////////////////////////////////////////
	// URL - path (routing...)
	/////////////////////////////////////////////////////////////
	if( qtype == null ) {
		var url_path = qry.pathname;
		var url_item = url_path.split("/");

		var filename = null;
		if( url_item.length > 0 ) {
			for( var item of url_item ) {
				item.trim();
				console.log("url:" + item);

				if( item.indexOf("..") > 0 ||
					item.indexOf("~") > 0 ) {
					filename = null;
					break;
				}

				if( item.indexOf(".html") > 0 ||
					item.indexOf(".css") > 0 ) {
					console.log("file:" + item);
					filename = item;
					break;
				}
			}

			if( filename == null ) {
				filename = "view_main.html";
			}
		}

		console.log("filename:" + filename);
		if( filename.length > 0 ) {
			console.log("Routing...........[" + filename + "]");

			// res.sendFile("./view_tcp.js");
			// res.sendFile("view_tcp.js", {root: __dirname});
			fs.readFile(filename, function(err, data) {
				// if( err ) throw err;
				if( err ) { console.log("view_tcp.js error..."); return; }
				
				if( filename.indexOf(".html") > 0 ) {
					res.writeHead(200, {'Content-Type': 'text/html'});
				} else 
				if( filename.indexOf(".css") > 0 ) {
					res.writeHead(200, {'Content-Type': 'text/css'});
				}

				res.write(data);
				res.end();
				
				console.log("Routing finish... [" + filename + "]");
			});
		}
		console.log("path:" + qry.pathname);
		return;
	}

	/////////////////////////////////////////////////////////////
	// URL - type
	/////////////////////////////////////////////////////////////
	if( qtype == 'push' ) {
		push.push_gcm(req.body, function(err, result) {
		    console.log(JSON.stringify(result));

			res.writeHead(200, {'Content-Type': 'text/html'});
		    res.write(JSON.stringify(result));
		    res.end();
		});
	    return;
	} else {
		var funcs = {
			info: psys.info,
			cpu : psys.cpu,
			mem : psys.mem,
			tcp : psys.tcp,
			udp : psys.udp,
			ipcq : psys.ipcq,
			ipcm : psys.ipcm,
			ipcs : psys.ipcs,
			amem : pdat.mem,
		};
		var names = [];
		var procs = null;

		console.log("type[" + qtype + "]");
		names = [qtype,];
		procs = [funcs[qtype]];
	}

	/////////////////////////////////////////////////////////////
	// Type - check
	/////////////////////////////////////////////////////////////
	if( procs == null )
	{
		var tmps = [];
		var fpos = 0;
		for( var key in funcs ) {
			// console.log("key:" + key);
			// console.log("val:" + funcs[key]);
			names[fpos] = key;
			tmps[fpos] = funcs[key];

			fpos++;
		}
		procs = tmps;
	}

	/////////////////////////////////////////////////////////////
	// Processing...
	/////////////////////////////////////////////////////////////
	var dt_s = new Date().getTime();
	async.parallel(procs, 
		function(err, results) {
			var nowd = new Date();
			var sysinfo = {};

			if( qtype == null ) {
				for( var opos=0; opos< results.length; opos++ ) {
					var key = names[opos];
					var rst = results[opos];
					if( rst == null ) continue;

					sysinfo[key] = rst;
				}

				// sysinfo["date"] = ustd.dateFormat(nowd, "%Y%m%d", false);
				// sysinfo["time"] = ustd.dateFormat(nowd, "%H%M%S", false);
			} else {
				sysinfo = results[0];
			}

			var rtn = JSON.stringify(sysinfo);

			console.log("-------------------------------------------");
			console.log("async:" + rtn);
			console.log("-------------------------------------------");

			console.log('elapsed time : '+(nowd.getTime() - dt_s));

		    // res.writeHead(200, { 'Content-Type': 'text/plain' });
		    res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(rtn);
		    res.end();
		}
	);
}

function server_accepted(req, res)
{
	console.log("####################################################################");
	console.log("Accepted...");

	if( req.method == 'POST' ) {
		console.log("Method: POST");
		var body = '';

		req.on('data', function (data) {
	        body += data;
	        if (body.length > 1e6) { 
	            req.connection.destroy();
	        }
	    });
	    req.on('end', function () {
			req.body = body;
			console.log("body:" + body);
			console.log("body:" + req.body);
			
			recv_after(req, res);
		});
	} else {
		console.log("Method: GET");
		req.body = null;

		recv_after(req, res);
	}
}

////////////////////////////////////////////////////////////////////////
// Clustering...
if (cluster.isMaster) {
	console.log(`# Master ${process.pid} is running`);

	// Fork workers.
	var numCPUs = 1; // require('os').cpus().length;
	for( var i = 0; i < numCPUs; i++ ) {
		cluster.fork();
	}

	cluster.on('online', function(worker) {
		console.log('# Worker ' + worker.process.pid + ' is online');
	});

	cluster.on('exit', (worker, code, signal) => {
		console.log(`# worker ${worker.process.pid} died`);
	});

	var server_main = http.createServer(server_accepted);
	server_main.listen(port);
	console.log("# Server running at http://127.0.0.1:8081");

} else {
	var pdba = require('./proc_db');

	console.log('# Child ' + process.pid + ' is running');

	psys.mem(pdba.mem_insert);
	psys.ipcq(pdba.ipcq_insert);
	psys.tcp(pdba.tcp_insert);
	psys.udp(pdba.udp_insert);

	setInterval(function() {
		var nowTime = ustd.dateFormat(new Date(), "%H:%M:%S", false);
		console.log('# loop : ' + nowTime.toString());

		psys.mem(pdba.mem_insert);
		psys.ipcq(pdba.ipcq_insert);
		psys.tcp(pdba.tcp_insert);
		psys.udp(pdba.udp_insert);
	}, 60*1000);
}
