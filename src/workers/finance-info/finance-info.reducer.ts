import {createReducer} from '@reduxjs/toolkit';
import {Channel, Message} from 'amqplib/callback_api';

import {
    finishSyncsAction,
    getFinanceInfoAction,
    requestFinanceInfoAction,
    saveFinanceInfoPageAfterAction,
} from './finance-info.actions';

export interface FinanceInfoState {
    code?: string;
    lastYear?: number;
    lastQuarter?: number;
    channel?: Channel;
    msg?: Message;
    page?: number;
    termType: number;
}

const FinanceInfoReducerFactory = (): FinanceInfoState => ({
    termType: 1,
});

export const financeInfoReducer = createReducer(
    FinanceInfoReducerFactory(),
    (builder) => {
        builder
            .addCase(getFinanceInfoAction, (state, action) => {
                state.channel = action.payload.channel;
                state.msg = action.payload.msg;
                state.termType = action.payload.termType;
            })
            .addCase(requestFinanceInfoAction, (state, action) => {
                state.page = action.payload.page;
                if (action.payload.lastYear) {
                    state.lastYear = action.payload.lastYear;
                }
                if (action.payload.lastQuarter) {
                    state.lastQuarter = action.payload.lastQuarter;
                }
            })
            .addCase(saveFinanceInfoPageAfterAction, (state, action) => {
                if (action.payload.lastYear) {
                    state.lastYear = action.payload.lastYear;
                }
                if (action.payload.lastQuarter) {
                    state.lastQuarter = action.payload.lastQuarter;
                }
            })
            .addCase(finishSyncsAction, () => {
                return FinanceInfoReducerFactory();
            });
    },
);
