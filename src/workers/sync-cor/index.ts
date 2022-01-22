import { VietStockCrds, VietStockCredentialsInterface } from '@requests/vietstock/credentials';
import { retrieveCor } from '@requests/vietstock/corporate';
import { AbstractApplication } from '@app/abstract-application';
import { storeManager } from '@app/store';
import { syncCorReducer } from './sync-cor.reducer';
import { syncCorEffects } from './sync-cor.effects';

export const syncCor = async (vsCreds?: VietStockCredentialsInterface) => {
  if (typeof vsCreds === 'undefined') {
    vsCreds = await VietStockCrds.retrieveCredentials();
  }
  let currentPage = 1;
  const getCor = async (page: any) => {
    try {
      const _data = await retrieveCor(page, vsCreds);
      const _pData = JSON.parse(_data);
      currentPage++;

      return _pData;
    } catch (e) {
      console.log('error', e);
    }
  };

  getCor(currentPage);
};

storeManager.mergeReducers({
  syncCor: syncCorReducer,
});

storeManager.addEpics('sync-cor',[...syncCorEffects])

class SyncCor extends AbstractApplication {
  protected async main(): Promise<void> {
    console.log('run get corporate');
    return Promise.resolve(undefined);
  }
}

const _i = new SyncCor();
_i.run();
