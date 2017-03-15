var fs = require("fs");
var async = require('async');

function parseInfo(col) {
	var str = col;
	var pos = str.search(":");
	if( pos > 0 )
		return str.substr(pos + 1).trim();
	return "";
}
module.exports.cpu = function(callback)
{
	fs.readFile('/proc/cpuinfo', function(err,data) {
		console.log("proc_cpu ------------------------------>");

		var obj_cpu = {};

		var cpucnt = 0;
		var cols = data.toString().split("\n");
		for( var cpos=0; cpos< cols.length; cpos++ ) {
			// console.log("col["+cpos+"]");

			if( cols[cpos].includes("model name") ) {
				if( obj_cpu.model == null ) {
					obj_cpu.model = parseInfo(cols[cpos]);
				}
				cpucnt++;
			}
			else
			if( cols[cpos].includes("cpu MHz") ) {
				if( obj_cpu.MHz == null ) {
					obj_cpu.MHz = parseInfo(cols[cpos]);
				}
			}
			else
			if( cols[cpos].includes("cache size") ) {
				if( obj_cpu.cache == null ) {
					obj_cpu.cache = parseInfo(cols[cpos]);
				}
			}
			else
			if( cols[cpos].includes("stepping") ) {
				if( obj_cpu.stepping == null ) {
					obj_cpu.stepping = parseInfo(cols[cpos]);
				}
			}
			else
			if( cols[cpos].includes("vendor_id") ) {
				if( obj_cpu.vendor_id == null ) {
					obj_cpu.vendor_id = parseInfo(cols[cpos]);
				}
			}
			else
			if( cols[cpos].includes("bogomips") ) {
				if( obj_cpu.bogomips == null ) {
					obj_cpu.bogomips = parseInfo(cols[cpos]);
				}
			}
			/*
			else
			if( cols[cpos].includes("flags") ) {
				if( obj_cpu.flags == null ) {
					obj_cpu.flags = parseInfo(cols[cpos]);
				}
			}
			*/
		}

		obj_cpu.count = parseInt(cpucnt);
		console.log("cpu=" + JSON.stringify(obj_cpu));
		console.log("<------------------------------ proc_cpu");
		callback(null, obj_cpu);
	});
}

module.exports.mem = function(callback)
{
	fs.readFile('/proc/meminfo', function(err,data) {
		console.log("proc_mem ------------------------------>");
		
		var obj_mem = {};

		var swap_tot = 0;
		var swap_free = 0;
		var cols = data.toString().split("\n");
		for( var cpos=0; cpos< cols.length; cpos++ ) {
			// console.log("col["+cpos+"]");
			
			if( cols[cpos].includes("MemTotal") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.total = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("MemFree") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.free = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("MemAvailable") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.available = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("SwapTotal") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) swap_tot = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("SwapFree") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) swap_free = parseInt(str.substr(pos + 1).trim());
			}
		}
		obj_mem.swap = swap_tot - swap_free;

		console.log("mem=" + JSON.stringify(obj_mem));
		console.log("<------------------------------ proc_mem");
		callback(null, obj_mem);
	});
}

module.exports.info = function(callback)
{
	console.log("proc_net ------------------------------>");

	async.parallel([module.exports.cpu, module.exports.mem], function(err, results) {
		var obj_net = {
			cpu : {},
			mem : {},
		};
		obj_net.cpu = results[0];
		obj_net.mem = results[1];

		console.log("<------------------------------ proc_net");
		callback(null, obj_net);
	});
}

function hexToIP(val)
{
	var ip1 = parseInt("0x" + val.substr(0, 2));
	var ip2 = parseInt("0x" + val.substr(2, 2));
	var ip3 = parseInt("0x" + val.substr(4, 2));
	var ip4 = parseInt("0x" + val.substr(6, 2));
	
	return ip4 + "." + ip3 + "." + ip2 + "." + ip1;
}

module.exports.tcp = function(callback)
{
	fs.readFile('/proc/net/tcp', function(err,data) {
		console.log("proc_net.net_tcp ------------------------------>");

		var obj_arr = [];
		var arrcnt = 0;
		var loopcnt = 0;

		if( err != null ) {
			console.log("net_tcp... err");
			callback(null, null);
			return;
		}

		data.toString().split("\n").forEach( function(line) {
			if( loopcnt <= 0 ) {
				loopcnt++;
				return;
			}
			loopcnt++;

			line = line.trim();
			if( line == null || line.length <= 0 ) {
				// console.log("line length error... [" + line.length + "]");
				return;
			}

			var obj_tcp  = {};

			var record = line.replace(/\s+/g,' ');
			if( record == null ) {
				console.log("record is null");
				return;
			}

			var items = record.split(' ').map(function(item) {
				return item.trim();
			});
			if( items == null || items.length < 7 ) {
				console.log("items.length < 7");
				return;
			}

			var cols;
			
			// local_address
			cols = items[1].split(':');
			if( cols != null ) {
				obj_tcp.lip   = hexToIP(cols[0]);
				obj_tcp.lport = parseInt("0x" + cols[1]);
			}

			// remote_address
			cols = items[2].split(':');
			if( cols != null ) {
				obj_tcp.rip   = hexToIP(cols[0]);
				obj_tcp.rport = parseInt("0x" + cols[1]);
			}

			// status
			var net_state = {
				0  : "NONE" ,
				1  : "ESTABLISHED" ,
				2  : "SYN_SENT" ,
				3  : "SYN_RECV" ,
				4  : "FIN_WAIT1" ,
				5  : "FIN_WAIT2" ,
				6  : "TIME_WAIT" ,
				7  : "CLOSE" ,
				8  : "CLOSE_WAIT" ,
				9  : "LAST_ACK" ,
				10 : "LISTEN" ,
				11 : "CLOSING" ,
			};
			obj_tcp.st = net_state[ parseInt("0x" + items[3]) ];

			// tx,rx
			cols = items[4].split(':');
			if( cols != null ) {
				obj_tcp.tx_queue   = parseInt("0x" + cols[0]);
				obj_tcp.rx_queue = parseInt("0x" + cols[1]);
			}

			obj_arr[arrcnt] = obj_tcp;
			arrcnt++;
		});

		// console.log("net_tcp:" + JSON.stringify(obj_arr));
		console.log("<------------------------------ proc_net.net_tcp");
		callback(null, obj_arr);
	});
}

module.exports.udp = function(callback)
{
	fs.readFile('/proc/net/udp', function(err,data) {
		console.log("proc_net.net_udp ------------------------------>");

		var obj_arr = [];
		var arrcnt = 0;
		var loopcnt = 0;

		if( err != null ) {
			console.log("net_udp... err");
			callback(null, null);
			return;
		}

		data.toString().split("\n").forEach( function(line) {
			if( loopcnt <= 0 ) {
				loopcnt++;
				return;
			}
			loopcnt++;

			line = line.trim();
			if( line == null || line.length <= 0 ) {
				// console.log("line length error... [" + line.length + "]");
				return;
			}

			var obj_tcp  = {};

			var record = line.replace(/\s+/g,' ');
			if( record == null ) {
				console.log("record is null");
				return;
			}

			var items = record.split(' ').map(function(item) {
				return item.trim();
			});
			if( items == null || items.length < 7 ) {
				console.log("items.length < 7");
				return;
			}

			var cols;
			
			// local_address
			cols = items[1].split(':');
			if( cols != null ) {
				obj_tcp.lip   = hexToIP(cols[0]);
				obj_tcp.lport = parseInt("0x" + cols[1]);
			}

			// remote_address
			cols = items[2].split(':');
			if( cols != null ) {
				obj_tcp.rip   = hexToIP(cols[0]);
				obj_tcp.rport = parseInt("0x" + cols[1]);
			}
			
			// status
			var net_state = {
				0  : "NONE" ,
				1  : "ESTABLISHED" ,
				2  : "SYN_SENT" ,
				3  : "SYN_RECV" ,
				4  : "FIN_WAIT1" ,
				5  : "FIN_WAIT2" ,
				6  : "TIME_WAIT" ,
				7  : "CLOSE" ,
				8  : "CLOSE_WAIT" ,
				9  : "LAST_ACK" ,
				10 : "LISTEN" ,
				11 : "CLOSING" ,
			};
			obj_tcp.st = net_state[ parseInt("0x" + items[3]) ];

			// tx,rx
			cols = items[4].split(':');
			if( cols != null ) {
				obj_tcp.tx_queue   = parseInt("0x" + cols[0]);
				obj_tcp.rx_queue = parseInt("0x" + cols[1]);
			}

			obj_arr[arrcnt] = obj_tcp;
			arrcnt++;
		});

		// console.log("net_udp:" + JSON.stringify(obj_arr));
		console.log("<------------------------------ proc_net.net_udp");
		callback(null, obj_arr);
	});
}

module.exports.net = function(callback)
{
	console.log("proc_net ------------------------------>");

	async.parallel([module.exports.tcp, module.exports.udp], function(err, results) {
		var obj_net = {
			tcp : [],
			udp : [],
		};
		obj_net.tcp = results[0];
		obj_net.udp = results[1];

		console.log("<------------------------------ proc_net");
		callback(null, obj_net);
	});
}

module.exports.ipcq = function(callback)
{
	fs.readFile('/proc/sysvipc/msg', function(err,data) {
		console.log("ipc-msg ------------------------------>\n");

		var obj_arr = [];
		var arrcnt = 0;
		var loopcnt = 0;

		if( err != null ) {
			console.log("ipc-msg... err");
			callback(null, null);
			return;
		}

		data.toString().split("\n").forEach( function(line) {
			if( loopcnt <= 0 ) {
				loopcnt++;
				return;
			}
			loopcnt++;

			line = line.trim();
			if( line == null || line.length <= 0 ) {
				// console.log("line length error... [" + line.length + "]");
				return;
			}

			var obj_ipcq = {};

			var record = line.replace(/\s+/g,' ');
			if( record == null ) {
				console.log("record is null");
				return;
			}

			var items = record.split(' ').map(function(item) {
				return item.trim();
			});
			if( items == null || items.length < 7 ) {
				console.log("items.length < 7");
				return;
			}

			obj_ipcq.key     = items[0];
			obj_ipcq.shmid   = items[1];
			obj_ipcq.perms   = items[2];
			obj_ipcq.cbytes  = items[3];
			obj_ipcq.qnum    = items[4];

			obj_ipcq.lspid   = items[5];
			obj_ipcq.lrpid   = items[6];
			obj_ipcq.uid     = items[7];
			obj_ipcq.gid     = items[8];

			obj_ipcq.stime   = items[9];
			obj_ipcq.rtime   = items[10];
			obj_ipcq.ctime   = items[11];

			obj_arr[arrcnt] = obj_ipcq;
			arrcnt++;
		});

		console.log("ipc-msg=" + JSON.stringify(obj_arr) + "\n");
		console.log("<------------------------------ ipc-msg\n");
		callback(null, obj_arr);
	});
}

module.exports.ipcm = function(callback)
{
	fs.readFile('/proc/sysvipc/shm', function(err,data) {
		console.log("ipc-shm ------------------------------>\n");

		var obj_arr = [];
		var arrcnt = 0;
		var loopcnt = 0;

		if( err != null ) {
			console.log("ipc-shm... err");
			callback(null, null);
			return;
		}

		data.toString().split("\n").forEach( function(line) {
			if( loopcnt <= 0 ) {
				loopcnt++;
				return;
			}
			loopcnt++;

			line = line.trim();
			if( line == null || line.length <= 0 ) {
				// console.log("line length error... [" + line.length + "]");
				return;
			}

			var obj_ipcm = {};

			var record = line.replace(/\s+/g,' ');
			if( record == null ) {
				console.log("record is null");
				return;
			}

			var items = record.split(' ').map(function(item) {
				return item.trim();
			});
			if( items == null || items.length < 7 ) {
				console.log("items.length < 7");
				return;
			}
			// key
			obj_ipcm.key     = items[0];
			obj_ipcm.shmid   = items[1];
			obj_ipcm.perms   = items[2];
			obj_ipcm.size    = items[3];
			//                   items[4]; // cpid
			//                   items[5]; // lpid
			obj_ipcm.nattach = items[6];
			obj_ipcm.muid    = items[7];
			obj_ipcm.mgid    = items[8];
			//                   items[9]; // cuid
			//                   items[10]; // cgid
			obj_ipcm.atime   = items[11];
			obj_ipcm.dtime   = items[12];
			obj_ipcm.ctime   = items[13];
			obj_ipcm.res     = items[14];
			obj_ipcm.swap    = items[15];

			obj_arr[arrcnt] = obj_ipcm;
			arrcnt++;
		});

		console.log("ipc-shm=" + JSON.stringify(obj_arr) + "\n");
		console.log("<------------------------------ ipc-shm\n");
		callback(null, obj_arr);
	});
}

module.exports.ipcs = function(callback)
{
	fs.readFile('/proc/sysvipc/sem', function(err,data) {
		console.log("ipc-sem ------------------------------>\n");

		var obj_arr = [];
		var arrcnt = 0;
		var loopcnt = 0;

		if( err != null ) {
			console.log("ipc-sem... err");
			callback(null, null);
			return;
		}

		data.toString().split("\n").forEach( function(line) {
			if( loopcnt <= 0 ) {
				loopcnt++;
				return;
			}
			loopcnt++;

			line = line.trim();
			if( line == null || line.length <= 0 ) {
				// console.log("line length error... [" + line.length + "]");
				return;
			}

			var obj_ipcs = {};

			var record = line.replace(/\s+/g,' ');
			if( record == null ) {
				console.log("record is null");
				return;
			}

			var items = record.split(' ').map(function(item) {
				return item.trim();
			});
			if( items == null || items.length < 7 ) {
				console.log("items.length < 7");
				return;
			}

			// key
			obj_ipcs.key     = items[0];
			obj_ipcs.semid   = items[1];
			obj_ipcs.perms   = items[2];
			obj_ipcs.nsems   = items[3];
			obj_ipcs.uid     = items[5];
			obj_ipcs.gid     = items[6];
			obj_ipcs.otime   = items[7];
			obj_ipcs.ctime   = items[8];

			obj_arr[arrcnt] = obj_ipcs;
			arrcnt++;
		});

		console.log("ipc-sem=" + JSON.stringify(obj_arr) + "\n");
		console.log("<------------------------------ ipc-sem\n");
		callback(null, obj_arr);
	});
}
