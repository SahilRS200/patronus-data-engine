var Websocket = require('ws');
var wserver;
var broadCastMsg = function (msg, author, self) {
    //console.log(`in broadcast ${msg}`);
    wserver.clients.forEach(e => {
        if (Object.is(e, self)) {
            // console.log("in is loop");
            //continue;
        }
        else if (author) {
            var msgB = {};
            msgB.type = "BROADCAST"
            msgB.author = author
            msgB.payload = msg
            e.send(JSON.stringify(msgB));
        }
        else { e.send(msg); }
    });
}
exports.broadCastMsg=broadCastMsg;
exports.startWebSocketServer = function (server) {
    var connections = {}
    wserver = new Websocket.Server({
        verifyClient: false,
        server: server,
        path: '/wsinit'
    });

    wserver.on('connection', function (wsocket) {
        //console.log(wsocket);
        // wsocket.send('Hi there, I am a WebSocket server');
        if(typeof keepaliveInterval !== 'undefined') {
            startKeepAliveTimer();
        }
        broadCastMsg('we have a new member', 'OBDSERVER');
       // LiveScore.sendLatest(wsocket);
        // var iotctl;
        // try {
        //     iotctl = require('../controllers/iotcontroller');
        // }
        // catch (err) {
        //     console.log(err);
        // }
       // LiveScore.startLiveScoreAPI();
        wsocket.on('message', function (msg) {
            try {
                var payload = JSON.parse(msg);
                console.log(payload.msg);
                // if(payload.type==='IOT') {
                //     console.log('intercepted iot');
                   
                //    iotctl.processPing(payload , wsocket);
                // }
                // else if (payload.type === 'BROADCAST') {
                //     broadCastMsg(payload.msg, payload.author);
                // }
                // else {
                //     try { require('./websocketaction').mapActionToMethod(payload, wsocket); }
                //     catch (e) {
                //         console.log(e);
                //         wsocket.send(JSON.stringify({ err: "Incorrect action" }));
                //     }
                // }
            }
            catch (e) {
                console.log(e);
                wsocket.send(JSON.stringify({ err: "Incorrect json" }));
            }
        });
    });


    // wserver.on('request', function(request) {
    //     console.log(request);
    //     var connection = request.accept(null, request.origin);
    //     console.log(connection);
    //     connection.on('message', function(message) {
    //         console.log(message);
    //     });
    //     connection.on('close', function(connection) {
    //         // close user connection
    //         console.log("connection closed");
    //       });
    // });
}