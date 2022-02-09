import amqp, {Channel} from 'amqplib/callback_api';

import {CFG} from '../values/CFG';

export const directMessageConsume = (
    queueName: string,
    callback: (c: Channel, m: string) => Promise<void>,
) => {
    amqp.connect(CFG.RABBITMQ_HOST, async (error0, connection) => {
        if (error0) {
            throw error0;
        }
        await connection.createChannel(async (err, channel) => {
            if (err) {
                console.error('Could not create channel', err);
                throw err;
            }
            await channel.assertQueue(queueName, {
                durable: true,
            });
            await channel.prefetch(1);
            console.log(
                ' [*] Waiting for messages in %s. To exit press CTRL+C',
                queueName,
            );
            await channel.consume(
                queueName,
                async (msg) => {
                    await callback(channel, msg.content.toString());
                },
                {
                    // manual acknowledgment mode,
                    // see ../confirms.html for details
                    noAck: false,
                },
            );
        });
    });
};
