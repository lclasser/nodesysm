var port = 8081;
// var port = process.env.port || 1337;

var fs = require("fs");
var http = require('http');
var async = require('async');
var url = require('url');

var sysm = require('./proc_sys');

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

function server_accepted(req, res)
{
	console.log("####################################################################");
	console.log("Accepted...");

	var qry = url.parse(req.url, '&');

	/////////////////////////////////////////////////////////////
	// URL - path (routing...)
	/////////////////////////////////////////////////////////////
	var url_path = qry.pathname;
	var url_item = url_path.split("/");

	for( var item of url_item ) {
		console.log("url:" + item);
		if( item.length > 0 ) {
			console.log("Routing...........[" + item + "]");

			// res.sendFile("./view_tcp.js");
			// res.sendFile("view_tcp.js", {root: __dirname});
			fs.readFile(item, function(err, data) {
				// if( err ) throw err;
				if( err ) { console.log("view_tcp.js error..."); return; }
				res.write(data);
				res.end();
				
				console.log("Routing finish... [" + item + "]");
			});
			return;
		}
	}
	console.log("path:" + qry.pathname);

	/////////////////////////////////////////////////////////////
	// URL - type
	/////////////////////////////////////////////////////////////
	var funcs = {
		cpu : sysm.cpu,
		mem : sysm.mem,
		tcp : sysm.tcp,
		udp : sysm.udp,
	};
	var names = [];
	var procs = null;

	var qtype = null;
	if( qry != null ) {
		qtype = qry.query['type'];

		console.log("type[" + qtype + "]");
		if( qtype != null ) {
			names = [qtype,];
			procs = [funcs[qtype]];
		}
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

			console.log("#########################################\n");
			console.log("async:" + rtn);
			console.log("#########################################\n");

			console.log('elapsed time : '+(nowd.getTime() - dt_s));

		    res.writeHead(200, { 'Content-Type': 'text/plain' });
		    // res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(rtn);
		    res.end();
		}
	);
}

var server_main = http.createServer(server_accepted);
server_main.listen(port);
console.log("Server running at http://127.0.0.1:8081");
