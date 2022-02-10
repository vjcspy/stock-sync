import {AbstractApplication} from '@app/abstract-application';
import {Cor} from '@entity/Cor';
import {queueChannelWrapper} from '@util/queueChannelWrapper';
import * as _ from 'lodash';
import {getRepository} from 'typeorm';

import {FinanceInfoValues} from '../workers/finance-info/finance-info.values';

class FinanceInfoPublisher extends AbstractApplication {
    protected main(): Promise<void> {
        return queueChannelWrapper(async (channel) => {
            channel.assertExchange(FinanceInfoValues.QUEUE_EXCHANGE, 'topic', {
                durable: true,
            });

            const corRepo = getRepository(Cor);
            const cors = await corRepo.find();
            _.forEach(cors, (c) => {
                channel.publish(
                    FinanceInfoValues.QUEUE_EXCHANGE,
                    FinanceInfoValues.QUEUE_ROUTING_KEY,
                    Buffer.from(c.code),
                );
                console.log(" [x] FINANCE_INFO sent '%s'", c.code);
            });
        });
    }
}

(() => {
    const _i = new FinanceInfoPublisher();
    _i.run();
})();
