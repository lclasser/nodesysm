var port = 8081;
// var port = process.env.port || 1337;

var fs = require("fs");
var http = require('http');
var async = require('async');
var url = require('url');

var sysm = require('./proc_sys');
var push = require('./proc_push');

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
			info: sysm.info,
			cpu : sysm.cpu,
			mem : sysm.mem,
			tcp : sysm.tcp,
			udp : sysm.udp,
			ipcq : sysm.ipcq,
			ipcm : sysm.ipcm,
			ipcs : sysm.ipcs,
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

				sysinfo["date"] = dateFormat(nowd, "%Y%m%d", false);
				sysinfo["time"] = dateFormat(nowd, "%H%M%S", false);
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

var server_main = http.createServer(server_accepted);
server_main.listen(port);
console.log("Server running at http://127.0.0.1:8081");
