import * as amqp from 'amqplib/callback_api';
import {Channel} from 'amqplib/callback_api';

import {CFG} from '../values/CFG';

export const queueChannelWrapper = async (
    publishFn: (channel: Channel) => Promise<void>,
) => {
    return amqp.connect(CFG.RABBITMQ_HOST, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async (error1, channel) => {
            if (error1) {
                throw error1;
            }

            await publishFn(channel);

            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 500);
        });
    });
};
