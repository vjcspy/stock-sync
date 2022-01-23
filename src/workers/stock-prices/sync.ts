import { AbstractApplication } from '@app/abstract-application';
import { getCurrentStatus } from './fns/getCurrentStatus';
import { getPrice } from '@requests/vndirect/price';
import { savePrices } from './fns/savePrices';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

const _sync = async (code: string) => {
  try {
    const currentStatus = await getCurrentStatus(code);

    if (currentStatus) {
      const lastDate = moment(currentStatus.lastDate);
      if (lastDate.year() < moment().year()) {
        const priceData = await getPrice(code, lastDate.year() + 1);
        await savePrices(code, priceData);
        await _sync(code);
      } else {
        const priceData = await getPrice(code, lastDate.year());
        const priceFiltered = _.filter(priceData.data, (p: any) => moment(p['date']).isAfter(lastDate));

        if (priceFiltered.length > 0) {
          await savePrices(code, { data: priceFiltered });
        }

        return;
      }
    } else {
      const priceData = await getPrice(code, 2016);
      await savePrices(code, priceData);
      await _sync(code);
    }
  } catch (e) {
    console.log('error', e);
  }

};

class SyncStock extends AbstractApplication {
  protected async main(): Promise<void> {
    _sync('VNM');
    return Promise.resolve(undefined);
  }
}

export const syncStock = () => {
  const _i = new SyncStock();
  _i.run();
};
