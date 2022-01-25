import { AbstractApplication } from '@app/abstract-application';
import { store, storeManager } from '@app/store';
import { stockPricesEffects } from './stock-prices.effects';
import { stockPricesStartAction } from './stock-prices.actions';
import { stockPriceReducer } from './stock-price.reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqp = require('amqplib/callback_api');
storeManager.mergeReducers({
  stockPrice: stockPriceReducer,
});
storeManager.addEpics('stock_prices', [...stockPricesEffects]);

class SyncStock extends AbstractApplication {
  protected async main(): Promise<void> {
    amqp.connect('amqp://vm', async (error0, connection) => {
      if (error0) {
        throw error0;
      }
      const queue = 'stock_prices_queue';
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });
      await channel.prefetch(1);
      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
      await channel.consume(queue, async msg => {
        store.dispatch(stockPricesStartAction({
          code: msg.content.toString(),
        }));

      }, {
        // manual acknowledgment mode,
        // see ../confirms.html for details
        noAck: false,
      });
    });
  }
}

export const syncStock = () => {
  const _i = new SyncStock();
  _i.run();
};
