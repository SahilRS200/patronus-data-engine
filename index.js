var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
// var ssl = require('./security');
app = express();
var keymapper =  require('./data.json');
var kafka = require('./kafka');
const { setupKafka , postMessage } = kafka;
// var appSecure = https.createServer(ssl.getSSLOptions());
port = process.env.PORT || 80;
// sslport = process.env.SSLPORT || 3443;
const wsocketserver= require('./websocketserver');
console.log(`in ${port}`);

var server = http.createServer(app).listen(port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200);
    }
    else { next(); }
});
    app.route('/keys')
        .get(function(req,res){
            res.status(200)
            res.json(keymapper)
        })
    app.route('/obd2')
        .get(function (req, res) {
            console.log(`broadcast at ${new Date()}`)
            const author = 'OBD'
            const msg = JSON.stringify(req.query);
            wsocketserver.broadCastMsg(msg,author)
            //enqueue to kafka
            postMessage(msg);
            res.status(200);
            res.send('OK!');
        });

var kafka = require('./kafka');
setupKafka()
setTimeout(function(){
    wsocketserver.startWebSocketServer(server);
    console.log('end of startup')
}, 5000)



