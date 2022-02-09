import {createAction, generateAction} from '@app/store/createAction';
import {VietStockCredentialsInterface} from '@requests/vietstock/credentials';

const START_SYNC_COR = 'START_SYNC_COR';
export const startSyncCor = createAction(START_SYNC_COR);

const corGetNextPage = generateAction<
    {vsCreds?: VietStockCredentialsInterface},
    {
        page: number;
        numOfRecords: number;
        runNextPage?: boolean;
    }
>('corGetNextPage');
export const corGetNextPageAction = corGetNextPage.ACTION;
export const corGetNextPageAfterAction = corGetNextPage.AFTER;
export const corGetNextPageErrorAction = corGetNextPage.ERROR;
