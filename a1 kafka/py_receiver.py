from confluent_kafka import Consumer
from confluent_kafka import KafkaException
from confluent_kafka import KafkaError


conf = {'bootstrap.servers': 'localhost:9092',
        'group.id': 'example_consumer_group2',
        'auto.offset.reset': 'smallest'}

consumer = Consumer(conf)

try :
    consumer.subscribe(["example_topic"])
    print('Subscribed')

    while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                print(msg.topic(), msg.partition(), msg.offset())
finally:
        # Close down consumer to commit final offsets.
        consumer.close()
