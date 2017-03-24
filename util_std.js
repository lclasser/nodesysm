var fs = require("fs");

module.exports.dateFormat = function(date, fstr, utc)
{
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

module.exports.sleepSync = function(milliSeconds)
{
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

var _passwd = null;
module.exports.getSysUser = function(myUid)
{
	if( _passwd == null ) {
		var passwd = fs.readFileSync('/etc/passwd', 'utf8'); 
		_passwd = passwd.trim().split(/\n/); 

		console.log("read passwd ...");
	}

	var passwd = _passwd;
	var items;
	for (var i = 0, l = passwd.length; i < l; i++) { 
		if (passwd[i].charAt(0) === '#') continue; 

		items = passwd[i].split(':'); 
		var otherName = items[0]; 
		var otherUid  = items[2]; 
		var otherGid  = items[3]; 
		if( otherUid && (otherUid == myUid) ) {
				return otherName;
		}
	}
	return '';
}

module.exports.decToHex = function(d, padding)
{
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

	hex = "0x" + hex;
    return hex;
}
