import './store';

import {AbstractApplication} from '@app/abstract-application';
import {topicMessageConsume} from '@util/topicMessageConsume';

import {getFinanceInfoAction} from './finance-info.actions';
import {FinanceInfoValues} from './finance-info.values';

class SyncYearWorker extends AbstractApplication {
    async main() {
        topicMessageConsume(
            FinanceInfoValues.QUEUE_EXCHANGE,
            FinanceInfoValues.QUEUE_SYNC_YEAR,
            FinanceInfoValues.QUEUE_ROUTING_KEY,
            async (channel, msg) => {
                console.log(
                    " [x] %s:'%s'",
                    msg.fields.routingKey,
                    msg.content.toString(),
                );

                this.getStore().dispatch(
                    getFinanceInfoAction({
                        channel,
                        msg,
                        termType: 1,
                    }),
                );
            },
        );
    }
}

const worker = new SyncYearWorker();
(() => {
    worker.run();
})();
