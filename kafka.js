var Kafka = require('node-rdkafka');
var kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
    "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
    "debug": "generic,broker,security"
  };

const prefix = process.env.CLOUDKARAFKA_USERNAME;
const topic_unprocessed_write = `${prefix}-unprocessed-ping`;

let producer = new Kafka.Producer(kafkaConf);;
let connectionFlag = false;
// const maxMessages = 200;

producer.on("ready", function(arg) {
    console.log(`producer ${arg.name} ready.`);
    connectionFlag = true;
  });
  
producer.on("disconnected", function(arg) {
    connectionFlag = false;
    setTimeout(producer.connect, 500)
  });
  
producer.on('event.error', function(err) {
    console.error(err);
    // process.exit(1);
    producer.disconnect()   
  });
producer.on('event.log', function(log) {
    console.log(log);
  });

const setupKafka = function() {
    producer.connect();
}
const genMessage = function(Obj) {
    let msg = ''
    if(typeof Obj !== 'String') {
        msg = JSON.stringify(Obj)
    } else {
        msg = Obj
    }
    return new Buffer(msg);
}
const postMessage = function(messageStr) {
    if(connectionFlag) {
        producer.produce(topic_unprocessed_write, -1, genMessage(messageStr), new Date().getTime())
    } else {
        // add buffer feature
        producer.connect();
    }
}

module.exports = {
    setupKafka,
    postMessage
}
