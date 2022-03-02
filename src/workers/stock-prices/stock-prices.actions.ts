import {generateAction} from '@app/store/createAction';
import {createAction} from '@reduxjs/toolkit';
import * as moment from 'moment';

const STOCK_PRICES_START = 'STOCK_PRICES_START';
export const stockPricesStartAction = createAction<{
    code: string;
}>(STOCK_PRICES_START);

const CHECK_STOCK_PRICE_STATUS = 'CHECK_STOCK_PRICE_STATUS';
export const checkStockPriceStatusAction = createAction(
    CHECK_STOCK_PRICE_STATUS,
);

const GET_STOCK_PRICES = 'GET_STOCK_PRICES';
const getStockPrices = generateAction<
    {code: string; year: number; lastDate?: moment.Moment},
    {
        data: any;
        code: string;
        year: number;
    }
>(GET_STOCK_PRICES);

export const getStockPricesAction = getStockPrices.ACTION;
export const getStockPricesAfterAction = getStockPrices.AFTER;
export const getStockPricesErrorAction = getStockPrices.ERROR;

const SAVE_STOCK_PRICES = 'SAVE_STOCK_PRICES';
const saveStockPrice = generateAction<
    {},
    {
        code: string;
        year: number;
    }
>(SAVE_STOCK_PRICES);

export const saveStockPriceAction = saveStockPrice.ACTION;
export const saveStockPriceAfterAction = saveStockPrice.AFTER;
export const saveStockPriceErrorAction = saveStockPrice.ERROR;

const STOCK_PRICES_FINISHED = 'STOCK_PRICES_FINISHED';
export const stockPricesFinishedAction = createAction<{
    code: string;
}>(STOCK_PRICES_FINISHED);
