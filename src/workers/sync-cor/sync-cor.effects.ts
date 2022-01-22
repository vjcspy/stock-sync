import { appInitAction } from '@app/store/actions';
import { map } from 'rxjs';
import { syncCorLoadNextPage } from './sync-cor.actions';
import { createEffect } from '@app/store/createEffect';
import { ofType } from '@app/store/ofType';

const whenAppInit$ = createEffect(action$ => action$.pipe(ofType(appInitAction), map(() => syncCorLoadNextPage())));

export const syncCorEffects = [whenAppInit$];
