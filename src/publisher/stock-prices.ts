import {AbstractApplication} from '@app/abstract-application';
import {Cor} from '@entity/Cor';
import amqp from 'amqplib/callback_api';
import * as _ from 'lodash';
import {getRepository} from 'typeorm';

import {CFG} from '../values/CFG';

export class StockPricesPublisher extends AbstractApplication {
    protected async main(): Promise<void> {
        return new Promise(() => {
            amqp.connect(CFG.RABBITMQ_HOST, async (error0, connection) => {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(async (err, channel) => {
                    if (err) {
                        console.error('Could not create channel', err);
                    }
                    const queue = 'stock_prices_queue';

                    await channel.assertQueue(queue, {
                        durable: true,
                    });

                    const corRepo = getRepository(Cor);
                    const cors = await corRepo.find();
                    _.forEach(cors, (c) => {
                        channel.sendToQueue(queue, Buffer.from(c.code), {
                            persistent: true,
                        });
                        console.log(" [x] Sent '%s'", c.code);
                    });

                    setTimeout(() => {
                        connection.close();
                        process.exit(0);
                    }, 500);
                });
            });
        });
    }
}

new StockPricesPublisher().run();
