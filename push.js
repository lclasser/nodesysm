
var gcm = require('node-gcm');
var http = require('http');

var server_access_key = 'AAAA8yX-Tsw:APA91bF8JvsbaLIXrAYSfluJxcvdCwF0c_kmK5TSYuIqu91qqsggmMYqkwdz1WbZBK-Km5UHYBcriqz16aEVv10IeYa46WjLCl7IhvOd0dNKC_KOMhcl4jSTnsufW-pHO9yzOySw4IoS';
var sender = new gcm.Sender(server_access_key);

function onRequest(req, res)
{
	if( req.method == 'POST' ) {
		var body = '';

		req.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                req.connection.destroy();
            }
        });

        req.on('end', function () {
			console.log("body:" + body);

			var body_obj = JSON.parse(body);
			var body_to  = JSON.stringify(body_obj.to);

			var message = new gcm.Message({
				data : body_obj.data,
			});

			sender.send(message, "/topics/noti", function (err, result) {  
			    console.log(JSON.stringify(result));

				res.writeHead(200, {'Content-Type': 'text/html'});
			    res.write(JSON.stringify(result));
			    res.end();
			});
        });
	}
}

var server = http.createServer(onRequest);
server.listen(8083, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8083/');


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
