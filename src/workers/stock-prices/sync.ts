import {AbstractApplication} from '@app/abstract-application';
import {storeManager} from '@app/store';
import {getPrice} from '@requests/vndirect/price';
import * as moment from 'moment';

import {CFG} from '../../values/CFG';
import {getCurrentStatus} from './fns/getCurrentStatus';
import {savePrices} from './fns/savePrices';
import {stockPriceReducer} from './stock-price.reducer';
import {stockPricesEffects} from './stock-prices.effects';
import {StockPricesValues} from './stock-prices.values';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqp = require('amqplib/callback_api');

storeManager.mergeReducers({
    stockPrice: stockPriceReducer,
});
storeManager.addEpics('stock_prices', [...stockPricesEffects]);

const syncPrice = async (code: string) => {
    console.log(`start sync price ${code}`);
    let currentStatus = await getCurrentStatus(code);
    console.log(`[${code}] ${JSON.stringify(currentStatus, null, 4)}`);
    const getPriceAndSave = async (year: number) => {
        currentStatus = await getCurrentStatus(code);
        console.log(`[${code}] getting data price year ${year}...`);
        const priceData = await getPrice(code, year);
        console.log(
            `[${code}] year ${year} with total elements: ${priceData?.totalElements}`,
        );
        if (priceData === null) {
            throw new Error(`[${code}] could not get data price`);
        } else {
            if (priceData.totalElements === 0) {
                // Năm này không có dữ liệu
                if (moment().year() > year) {
                    return getPriceAndSave(year + 1);
                }

                // kết thúc lấy giá
                return true;
            } else {
                if (year === moment().year()) {
                    // nếu dữ liệu là năm hiện tại thì chỉ lấy những ngày năm sau lastDate
                    let _savePrices: any[] = priceData.data;
                    if (currentStatus) {
                        const lastDate = moment(currentStatus.lastDate);
                        _savePrices = _savePrices.filter((p: any) =>
                            lastDate.isBefore(moment(p['date'], 'YYYY-MM-DD')),
                        );
                    }
                    if (_savePrices.length === 0) {
                        console.log(
                            `[${code}] finished because not have newer data`,
                        );
                        return true;
                    } else {
                        await savePrices(code, {
                            ...priceData,
                            data: _savePrices,
                        });

                        console.log(
                            `[${code}] saved ${_savePrices.length} records and finish`,
                        );
                        return true;
                    }
                } else {
                    await savePrices(code, priceData);
                    console.log(
                        `[${code}] saved ${priceData.length} records and query next year`,
                    );
                    return getPriceAndSave(year + 1);
                }
            }
        }
    };

    if (currentStatus) {
        const lastDate = moment(currentStatus.lastDate);
        if (lastDate.year() < moment().year()) {
            return getPriceAndSave(lastDate.year() + 1);
        } else {
            return getPriceAndSave(lastDate.year());
        }
    } else {
        await getPriceAndSave(StockPricesValues.START_YEAR);
    }
};

class SyncStock extends AbstractApplication {
    protected async main(): Promise<void> {
        amqp.connect(CFG.RABBITMQ_HOST, async (error0, connection) => {
            if (error0) {
                throw error0;
            }
            const queue = 'stock_prices_queue';
            const channel = await connection.createChannel();

            await channel.assertQueue(queue, {
                durable: true,
            });
            await channel.prefetch(1);
            console.log(
                ' [*] Waiting for messages in %s. To exit press CTRL+C',
                queue,
            );
            await channel.consume(
                queue,
                async (msg) => {
                    await syncPrice(msg.content.toString());
                    channel.ack(msg);
                },
                {
                    // manual acknowledgment mode,
                    // see ../confirms.html for details
                    noAck: false,
                },
            );
        });
    }
}

export const syncStock = () => {
    const _i = new SyncStock();
    _i.run();
};
