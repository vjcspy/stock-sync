import {Channel, Message} from 'amqplib/callback_api';
import * as amqp from 'amqplib/callback_api';

import {CFG} from '../values/CFG';

export const topicMessageConsume = async (
    exchange: string,
    queue: string,
    bindingKey: string | string[],
    consumeFn: (c: Channel, msg: Message) => Promise<void>,
) => {
    amqp.connect(CFG.RABBITMQ_HOST, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async (error1, channel) => {
            if (error1) {
                throw error1;
            }

            channel.assertExchange(exchange, 'topic', {
                durable: true,
            });
            channel.prefetch(1);
            channel.assertQueue(
                queue,
                {
                    durable: true,
                },
                (error2, q) => {
                    if (error2) {
                        throw error2;
                    }
                    console.log(
                        ' [*] Waiting for messages. To exit press CTRL+C',
                    );

                    const routingKey = Array.isArray(bindingKey)
                        ? bindingKey
                        : [bindingKey];
                    routingKey.forEach((_key) => {
                        channel.bindQueue(q.queue, exchange, _key);
                    });

                    channel.consume(
                        q.queue,
                        async (msg) => {
                            await consumeFn(channel, msg);
                        },
                        {
                            noAck: false,
                        },
                    );
                },
            );
        });
    });
};
