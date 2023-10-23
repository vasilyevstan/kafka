require('dotenv').config();
const { Kafka, logLevel } = require("kafkajs");

console.log('Kafka broker', process.env.KAFKA_BROKER_ADDRESS);

const kafka = new Kafka({brokers: [process.env.KAFKA_BROKER_ADDRESS], logLevel: logLevel.ERROR})
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

async function send () {
    
    console.log('Connecting');
    await producer.connect();
    console.log('Connected');

    console.log('sending');

    
    //while (true) {
        const sleepTime = 3 * Math.random() * 1000;

        await new Promise(async (res) => {
            await producer.send({
                topic: process.env.KAFKA_TOPIC,
                messages: [{key: 'kVassili', value: 'Pupkin'}]
            });

            console.log('message sent, sleeping ', sleepTime);
            setTimeout(() => res(null), sleepTime);
        });
    //}
}

async function receive () {
    console.log('Receiving');
    await consumer.subscribe({topic: process.env.KAFKA_TOPIC});

    await consumer.run({
        eachMessage: async ({message}) => {
            console.log('Received: ', message);

            console.log('--------------------------------');
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


send();

receive();
