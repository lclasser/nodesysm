
var gcm = require('node-gcm');

var gcm_access_key = 'AAAA8yX-Tsw:APA91bF8JvsbaLIXrAYSfluJxcvdCwF0c_kmK5TSYuIqu91qqsggmMYqkwdz1WbZBK-Km5UHYBcriqz16aEVv10IeYa46WjLCl7IhvOd0dNKC_KOMhcl4jSTnsufW-pHO9yzOySw4IoS';
var gcm_sender = new gcm.Sender(gcm_access_key);

module.exports.push_gcm = function(body, callback)
{
	console.log("body:" + body);

	var body_obj = JSON.parse(body);
	if( body_obj == null ) {
		callback(100, 'empty input');
		return;
	}
	var body_to  = JSON.stringify(body_obj.to);

	var message = new gcm.Message({
		data : body_obj.data,
	});

	gcm_sender.send(message, "/topics/noti", callback);
	
	/*
	function (err, result) {  
	    console.log(JSON.stringify(result));

		res.writeHead(200, {'Content-Type': 'text/html'});
	    res.write(JSON.stringify(result));
	    res.end();
	});
	*/
}

/*
var message = new gcm.Message({
	data : { 
		message : '안녕하세요', 
		title : 'push demo'
	}
});
*/

/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
sender.send(message, "/topics/noti".toString(), function (err, result) {  
    console.log(result);
});

curl http://127.0.0.1:8083 -k -H "Content-Type: application/json" -d "{ to: '/topics/noti', data: { message: '2', title : '1' } }"

curl http://127.0.0.1:8083 -k -H Content-Type: application/json -d { "to": "/topics/noti", "data": { "message": "2", "title" : "1" } }
 **/
