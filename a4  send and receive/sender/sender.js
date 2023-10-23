require('dotenv').config();
const { Kafka, logLevel } = require("kafkajs");

console.log('Kafka broker', process.env.KAFKA_BROKER_ADDRESS);

const brokersList = process.env.KAFKA_BROKER_ADDRESS.split(',');

console.log(brokersList);

const kafka = new Kafka({brokers: brokersList, logLevel: logLevel.ERROR})
const producer = kafka.producer();


async function send () {
    
    console.log('Connecting');
    await producer.connect();
    console.log('Connected');

    console.log('sending');

    for (let i = 0; i < 5; i++) {
        const sleepTime = 3 * Math.random() * 1000;

        await new Promise(async (res) => {
            await producer.send({
                topic: process.env.KAFKA_TOPIC,
                messages: [{key: 'kVassili', value: 'Pupkin'}]
            });

            console.log('message sent, sleeping ', sleepTime);
            setTimeout(() => res(null), sleepTime);
        });
    }

    process.exit(0);
}


process.on('SIGTERM', async () => {
    await consumer.disconnect();
    await producer.disconnect();
    process.exit(0);
});


send();


