import {createEffect} from '@app/store/createEffect';
import {ofType} from '@app/store/ofType';
import {EMPTY, from, map, switchMap} from 'rxjs';

import {getFinanceInfoAction} from './finance-info.actions';
import {getFinanceInfoStatus} from './fns/getFinanceInfoStatus';

const whenStartSync$ = createEffect((action$) =>
    action$.pipe(
        ofType(getFinanceInfoAction),
        switchMap((action) =>
            from(getFinanceInfoStatus(action.payload.code)).pipe(
                map((data) => {
                    console.log(data);
                    return EMPTY;
                }),
            ),
        ),
    ),
);

export const financeInfoEffects = [whenStartSync$];
