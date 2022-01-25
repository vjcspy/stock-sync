import { AbstractApplication } from '@app/abstract-application';
import { getRepository } from 'typeorm';
import { Cor } from '@entity/Cor';
import * as _ from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqp = require('amqplib/callback_api');


export class StockPricesPublisher extends AbstractApplication {
  protected async main(): Promise<void> {
    return new Promise(() => {
      amqp.connect('amqp://vm', async (error0, connection) => {
        if (error0) {
          throw error0;
        }
        const channel = await connection.createChannel();

        const queue = 'stock_prices_queue';

        await channel.assertQueue(queue, {
          durable: true,
        });

        const corRepo = getRepository(Cor);
        const cors = await corRepo.find();
        _.forEach(cors, c => {
          channel.sendToQueue(queue, Buffer.from(c.code), {
            persistent: true,
          });
          console.log(' [x] Sent \'%s\'', c.code);
        });


        setTimeout(() => {
          connection.close();
          process.exit(0);
        }, 500);
      });
    });
  }

}

(new StockPricesPublisher()).run();
