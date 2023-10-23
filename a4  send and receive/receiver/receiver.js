require('dotenv').config();
const { Kafka, logLevel } = require("kafkajs");

console.log('Kafka broker', process.env.KAFKA_BROKER_ADDRESS);

const kafka = new Kafka({brokers: [process.env.KAFKA_BROKER_ADDRESS], logLevel: logLevel.ERROR})
const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

async function receive () {
    console.log('Connecting to topic', process.env.KAFKA_TOPIC);
    await consumer.subscribe({topic: process.env.KAFKA_TOPIC});
    console.log('Receiving');

    await consumer.run({
        eachMessage: async ({message}) => {
            //console.log('Received: ', message);

            //console.log('--------------------------------');
            console.log({
                offset: message.offset,
                key: message?.key?.toString(),
                value: message?.value?.toString()
            });
        }
    });

    
}

process.on('SIGTERM', async () => {
    await consumer.disconnect();
    await producer.disconnect();
    process.exit(0);
});

receive();
