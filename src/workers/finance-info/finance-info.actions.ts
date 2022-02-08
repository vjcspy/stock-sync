import {generateAction} from "@app/store/createAction";

const GET_FINANCE_INFO = 'START_GET_FINANCE_INFO';
const getFinanceInfo = generateAction<{ channel: any }, {
    data: any
}>(GET_FINANCE_INFO);

export const getFinanceInfoAction = getFinanceInfo.ACTION;
export const getFinanceInfoAfterAction = getFinanceInfo.AFTER;
export const getFinanceInfoErrorAction = getFinanceInfo.ERROR;
