import {createEffect} from '@app/store/createEffect';
import {ofType} from '@app/store/ofType';
import {retrieveFinanceInfo} from '@requests/vietstock/financeInfo';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    asyncScheduler,
    catchError,
    concatMap,
    EMPTY,
    from,
    map,
    of,
    scheduled,
    switchMap,
    withLatestFrom,
} from 'rxjs';

import {
    getFinanceInfoAction,
    getFinanceInfoAfterAction,
    requestFinanceInfoAction,
    requestFinanceInfoAfterAction,
    requestFinanceInfoErrorAction,
    saveFinanceInfoPageAfterAction,
    saveFinanceInfoPageErrorAction,
} from './finance-info.actions';
import {FinanceInfoState} from './finance-info.reducer';
import {financeInfoLog} from './fns/financeInfoLog';
import {getFinanceInfoStatus} from './fns/getFinanceInfoStatus';
import {saveFinanceInfo} from './fns/saveFinaceInfo';

const whenStartSync$ = createEffect((action$) => {
    return action$.pipe(
        ofType(getFinanceInfoAction),
        switchMap((action) => {
            const code = action.payload.msg.content.toString();
            return from(getFinanceInfoStatus(code)).pipe(
                map((syncStatus) => {
                    financeInfoLog(code, `getFinanceInfoStatus`, syncStatus);
                    if (syncStatus) {
                        if (syncStatus.termType === 1) {
                            if (parseInt(syncStatus.year) < moment().year()) {
                                return requestFinanceInfoAction({
                                    code,
                                    page: 5,
                                    lastYear: parseInt(syncStatus.year),
                                });
                            } else {
                                return getFinanceInfoAfterAction({
                                    data: 'not syncs because current year is newest',
                                });
                            }
                        } else {
                            // TODO: trường hợp sync quarter
                        }
                    } else {
                        return requestFinanceInfoAction({
                            code,
                            page: 5,
                        });
                    }
                    return EMPTY;
                }),
            );
        }),
    );
});

const requestFinanceInfo$ = createEffect((action$, state$) =>
    action$.pipe(
        ofType(requestFinanceInfoAction),
        withLatestFrom(state$, (v1, v2) => [v1, v2.financeInfo]),
        concatMap((d) => {
            const action = d[0];
            const financeInfoState: FinanceInfoState = d[1];
            const code = action.payload.code;
            const page = action.payload.page;
            const termType = financeInfoState.termType;
            return from(retrieveFinanceInfo(code, termType, page)).pipe(
                map((data) => {
                    // make sure data valid
                    if (
                        Array.isArray(data) &&
                        data.length === 4 &&
                        Array.isArray(data[0]) &&
                        typeof data[1]['Chỉ số tài chính'] !== 'undefined'
                    ) {
                        // Lọc để chỉ lấy những khoảng thời gian chưa được save vào db
                        let times = [...data[0]];

                        if (
                            financeInfoState.termType === 1 &&
                            typeof financeInfoState.lastYear !== 'undefined'
                        ) {
                            times = _.filter(times, (time) => {
                                return (
                                    time.YearPeriod > financeInfoState.lastYear
                                );
                            });
                        } else {
                        }

                        if (times.length === 0) {
                            if (page !== 1) {
                                // page này không có dữ liệu
                                return requestFinanceInfoAction({
                                    code,
                                    page: page - 1,
                                });
                            } else {
                                if (data[0].length === 0) {
                                    return requestFinanceInfoErrorAction({
                                        error: new Error(
                                            'finance info data invalid',
                                        ),
                                    });
                                } else {
                                    return getFinanceInfoAfterAction({
                                        data: 'successfully, not found newer data',
                                    });
                                }
                            }
                        } else {
                            return requestFinanceInfoAfterAction({
                                data,
                                code,
                                page,
                                termType,
                            });
                        }
                    } else {
                        return requestFinanceInfoErrorAction({
                            error: new Error('finance info data invalid'),
                        });
                    }
                    return EMPTY;
                }),
            );
        }),
        catchError((err) =>
            scheduled(
                of(
                    requestFinanceInfoErrorAction({
                        error: err,
                    }),
                ),
                asyncScheduler,
            ),
        ),
    ),
);

const saveFinanceInfo$ = createEffect((action$) =>
    action$.pipe(
        ofType(requestFinanceInfoAfterAction),
        concatMap((action) => {
            return from(
                saveFinanceInfo(action.payload.code, action.payload.data),
            ).pipe(
                map((saveSuccess) => {
                    if (saveSuccess?.success === true) {
                        return saveFinanceInfoPageAfterAction({
                            lastYear: saveSuccess.lastYear,
                            lastQuarter: saveSuccess.lastQuarter,
                        });
                    } else {
                        return saveFinanceInfoPageErrorAction({
                            error: saveSuccess,
                        });
                    }
                }),
            );
        }),
    ),
);

const requestNextPage$ = createEffect((action$, state$) =>
    action$.pipe(
        ofType(saveFinanceInfoPageAfterAction),
        withLatestFrom(state$, (v1, v2) => [v1, v2.financeInfo]),
        map((d) => {
            const financeInfoState: FinanceInfoState = d[1];
            const code = financeInfoState.msg.content.toString();
            if (financeInfoState.page > 1) {
                return requestFinanceInfoAction({
                    page: financeInfoState.page - 1,
                    code,
                });
            } else {
                return getFinanceInfoAfterAction({data: 'successfully'});
            }
        }),
    ),
);

export const financeInfoEffects = [
    whenStartSync$,
    requestFinanceInfo$,
    saveFinanceInfo$,
    requestNextPage$,
];
