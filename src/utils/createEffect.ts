import { StateObservable } from 'redux-observable';
import { EMPTY, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export const createEffect = (
  effect: (
    action$: Observable<{ type: string }>,
    stateObservable: StateObservable<any>,
  ) => Observable<{ type: string } | Observable<never>>,
) => {
  return (
    action$: Observable<{ type: string }>,
    stateObservable: StateObservable<any>,
  ): Observable<{ type: string }> =>
    effect(action$, stateObservable).pipe(filter((a) => a !== EMPTY)) as any;
};
