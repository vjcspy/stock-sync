import {AbstractApplication} from '@app/abstract-application';
import {storeManager} from '@app/store';

import {startSyncCor} from './sync-cor.actions';
import {syncCorEffects} from './sync-cor.effects';
import {syncCorReducer} from './sync-cor.reducer';

storeManager.mergeReducers({
    syncCor: syncCorReducer,
});

storeManager.addEpics('sync-cor', [...syncCorEffects]);

class SyncCor extends AbstractApplication {
    protected async main(): Promise<void> {
        this.getStore().dispatch(startSyncCor({}));
        return Promise.resolve(undefined);
    }
}

const _i = new SyncCor();
_i.run();
