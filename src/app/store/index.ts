import {createStoreManager} from '@app/store/createStoreManager';
import {logActionByCode} from '@app/store/middleware/logActionByCode';
import {configureStore, createReducer} from '@reduxjs/toolkit';

export const storeManager = createStoreManager(
    {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        empty: createReducer({}, () => {}),
    },
    [],
);
export const middleware = () => [];

export const store = configureStore({
    reducer: storeManager.reduce,
    middleware: [...storeManager.middleware(), logActionByCode],
    devTools:
        process?.env?.NODE_ENV == 'production' ||
        process?.env?.NEXT_PUBLIC_NODE_ENV == 'production'
            ? false
            : {
                  maxAge: 50,
                  trace: true,
                  traceLimit: 10,
              },
});
storeManager.runEpic();
