var fs = require("fs");

module.exports.cpu = function(callback) {
	fs.readFile('/proc/cpuinfo', function(err,data) {
		console.log("proc_cpu ------------------------------>\n");

		var obj_cpu = {
			"cpu" : {
				model : null,
				MHz : null,
				count : 0
			},
		};

		var cpucnt = 0;
		var cols = data.toString().split("\n");
		for( var cpos=0; cpos< cols.length; cpos++ ) {
			// console.log("col["+cpos+"]");
			
			if( cols[cpos].includes("model name") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) {
					if( obj_cpu.cpu.model == null )
						obj_cpu.cpu.model = str.substr(pos + 1).trim();
					cpucnt++;
				}
			}
			else
			if( cols[cpos].includes("cpu MHz") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) {
					if( obj_cpu.cpu.MHz == null )
						obj_cpu.cpu.MHz = parseInt(str.substr(pos + 1).trim());
				}
			}
		}

		obj_cpu.cpu.count = parseInt(cpucnt);
		console.log("cpu=" + JSON.stringify(obj_cpu) + "\n");
		console.log("<------------------------------ proc_cpu\n");
		callback(null, obj_cpu);
	});
}

module.exports.mem = function(callback) {
	fs.readFile('/proc/meminfo', function(err,data) {
		console.log("proc_mem ------------------------------>\n");
		
		var obj_mem = { 
			"mem" : {
				total : 0, 
				free : 0, 
				available : 0, 
				swap : 0,
			},
		};

		var swap_tot = 0;
		var swap_free = 0;
		var cols = data.toString().split("\n");
		for( var cpos=0; cpos< cols.length; cpos++ ) {
			// console.log("col["+cpos+"]");
			
			if( cols[cpos].includes("MemTotal") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.mem.total = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("MemFree") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.mem.free = parseInt(str.substr(pos + 1).trim());
			}
			else
			if( cols[cpos].includes("MemAvailable") ) {
				var str = cols[cpos];
				var pos = str.search(":");
				if( pos > 0 ) obj_mem.mem.available = parseInt(str.substr(pos + 1).trim());
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
		obj_mem.mem.swap = swap_tot - swap_free;

		console.log("mem=" + JSON.stringify(obj_mem) + "\n");
		console.log("<------------------------------ proc_mem\n");
		callback(null, obj_mem);
	});
}

module.exports.net = function(callback) {
	console.log("proc_net ------------------------------>\n");
	var obj_net = {
		"net" : {
			tcp : [{
				local_address : "",
				rem_address : "",
				st : "",
				tx_queue : 0,
				rx_queue : 0,
			},],
			udp : [{
				local_address : "",
				rem_address : "",
				st : "",
				tx_queue : 0,
				rx_queue : 0,
			},],
		}
	};

	console.log("net=" + JSON.stringify(obj_net) + "\n");
	console.log("<------------------------------ proc_net\n");
	callback(null, obj_net);
}
