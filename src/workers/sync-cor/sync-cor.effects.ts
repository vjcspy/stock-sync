import { createEffect } from '@util/createEffect';
import { appInitAction } from '@app/store/actions';
import { map } from 'rxjs';
import { ofType } from '@util/ofType';
import { syncCorLoadNextPage } from './sync-cor.actions';

const whenAppInit$ = createEffect(action$ => action$.pipe(ofType(appInitAction), map(() => syncCorLoadNextPage())));

export const syncCorEffects = [whenAppInit$];
