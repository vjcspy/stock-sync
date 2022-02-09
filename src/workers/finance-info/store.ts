import {storeManager} from '@app/store';

import {financeInfoEffects} from './finance-info.effects';
import {financeInfoReducer} from './finance-info.reducer';

storeManager.mergeReducers({
    financeInfo: financeInfoReducer,
});

storeManager.addEpics('finance_info', [...financeInfoEffects]);
