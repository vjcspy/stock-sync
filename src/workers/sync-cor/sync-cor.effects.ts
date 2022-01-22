import { appInitAction } from '@app/store/actions';
import { EMPTY, map, of, switchMap, withLatestFrom } from 'rxjs';
import { syncCorLoadNextPage } from './sync-cor.actions';
import { createEffect } from '@app/store/createEffect';
import { ofType } from '@app/store/ofType';

const whenAppInit$ = createEffect(action$ => action$.pipe(ofType(appInitAction), map(() => syncCorLoadNextPage())));

const loadNextPage$ = createEffect((action$, state$) => action$.pipe(ofType(syncCorLoadNextPage), withLatestFrom(state$, (v1, v2) => [v1, v2.checkout.cart]), switchMap(() => {
    return of(EMPTY);
  }),
));

export const syncCorEffects = [whenAppInit$, loadNextPage$];
