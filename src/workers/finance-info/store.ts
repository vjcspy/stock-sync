import {storeManager} from "@app/store";
import {financeInfoReducer} from "./finance-info.reducer";

storeManager.mergeReducers({
    financeInfo: financeInfoReducer,
});

storeManager.addEpics('finance_info', []);
