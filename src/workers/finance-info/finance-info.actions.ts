import {generateAction} from '@app/store/createAction';
import {Message} from 'amqplib/callback_api';

const prefix = '$%FINANCE_INFO$%';

const GET_FINANCE_INFO = 'START_GET_FINANCE_INFO';
const getFinanceInfo = generateAction<
    {channel: any; msg: Message; termType?: number},
    {
        data: any;
    }
>(GET_FINANCE_INFO, prefix);

export const getFinanceInfoAction = getFinanceInfo.ACTION;
export const getFinanceInfoAfterAction = getFinanceInfo.AFTER;
export const getFinanceInfoErrorAction = getFinanceInfo.ERROR;

const requestFinanceInfo = generateAction<
    {
        code: string;
        page: number;
        lastYear?: number;
        lastQuarter?: number;
    },
    {
        data: any;
        code: string;
        page: string;
        termType: number;
    }
>('REQUEST_FINANCE_INFO', prefix);
export const requestFinanceInfoAction = requestFinanceInfo.ACTION;
export const requestFinanceInfoAfterAction = requestFinanceInfo.AFTER;
export const requestFinanceInfoErrorAction = requestFinanceInfo.ERROR;

const saveFinanceInfoPage = generateAction<
    {},
    {
        lastYear?: number;
        lastQuarter?: number;
    }
>('SAVE_FINANCE_INFO_PAGE', prefix);
export const saveFinanceInfoPageAfterAction = saveFinanceInfoPage.AFTER;
export const saveFinanceInfoPageErrorAction = saveFinanceInfoPage.ERROR;
