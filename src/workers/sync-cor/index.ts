import { AbstractApplication } from '@app/abstract-application';
import { storeManager } from '@app/store';
import { syncCorReducer } from './sync-cor.reducer';
import { syncCorEffects } from './sync-cor.effects';

storeManager.mergeReducers({
  syncCor: syncCorReducer,
});

storeManager.addEpics('sync-cor',[...syncCorEffects])

class SyncCor extends AbstractApplication {
  protected async main(): Promise<void> {
    console.log('run sync corporate');
    return Promise.resolve(undefined);
  }
}

const _i = new SyncCor();
_i.run();
