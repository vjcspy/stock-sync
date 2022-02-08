import {createReducer} from "@reduxjs/toolkit";
import {getFinanceInfoAction} from "./finance-info.actions";

export interface FinanceInfo {
    lastYear?: number;
    lastQuarter?: number;
    year?: number;
    quarter?: number;
    channel?: any;
}

const FinanceInfoReducerFactory = (): FinanceInfo => ({})

export const financeInfoReducer = createReducer(FinanceInfoReducerFactory(), builder => {
    builder.addCase(getFinanceInfoAction, (state, action) => {
        state.channel = action.payload.channel;
    })
});
